// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import connectToDatabaseMongoose from "../../../../shared/mongodbnew";
import User from "../../../../models/User";
import { generateAuditTrailTest, validateEmail } from "../../../utils";
import bcrypt from "bcrypt";

export async function POST(req) {
  // Connect to database
  const db = await connectToDatabaseMongoose();

  try {
    const body = await req.json();
    const { UT_User_Id, UT_Password, product_name } = body;

    if (!UT_User_Id) {
      return NextResponse.json(
        { error: "Email or Phone is required." },
        { status: 400 }
      );
    }

    if (!UT_Password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (!product_name) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    // Map product names to their indices in the UT_Product_Enabled string
    const productMap = {
      "URL shortener": 0,
      "HCJ": 1,
      "4Sign": 2,
      "Honour": 3,
      "TeeEvo": 4,
    };

    const productIndex = productMap[product_name];
    // console.log(productIndex, 'productIndex');
    if (productIndex === undefined) {
      return NextResponse.json(
        { error: "Invalid product name." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    let user = await User.findOne({ UT_User_Id });
    if (user) {
      const productEnabledArray = user.UT_Product_Enabled.split("");

      // Check if the user is already registered for the specified product
      if (productEnabledArray[productIndex] === "1") {
        return NextResponse.json(
          { success: false, message: "User already exists." },
          { status: 409 }
        );
      }

      // Update the UT_Product_Enabled field for the existing user
      productEnabledArray[productIndex] = "1";
      user.UT_Product_Enabled = productEnabledArray.join("");
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: `Successfully registered to ${product_name}.`,
        },
        { status: 200 }
      );
    }

    // Generate audit trail
    const auditTrail = await generateAuditTrailTest(req);

    // Hash the password
    const hashedPassword = await bcrypt.hash(UT_Password, 10);

    // Create the initial UT_Product_Enabled value
    const productEnabledArray = Array(Object.keys(productMap).length).fill("0");
    productEnabledArray[productIndex] = "1";

    // Create a new user object with validated data
    const newUser = {
      UT_User_Id,
      UT_Email: validateEmail(UT_User_Id) ? UT_User_Id : null,
      UT_Phone: validateEmail(UT_User_Id) ? null : UT_User_Id,
      UT_Login_Type: validateEmail(UT_User_Id) ? "02" : "01",
      UT_Password: hashedPassword,
      UT_Product_Enabled: productEnabledArray.join(""),
      UT_Audit_Trail: [auditTrail],
    };

    // Insert the new user into the database
    const createdUser = await User.create(newUser);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully registered to ${product_name}.`,
        UT_Product_Enabled: createdUser.UT_Product_Enabled,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error.message);

    // Handle duplicate key error (unique constraints)
    if (error.code === 11000) {
      const conflictField = Object.keys(error.keyValue)[0];
      if (conflictField === "UT_User_Id") {
        return NextResponse.json(
          { error: "UT_User_Id already exists." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

