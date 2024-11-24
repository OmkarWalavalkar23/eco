// // app/api/auth/signin/route.js
// import { NextResponse } from "next/server";
// import connectToDatabaseMongoose from "../../../../shared/mongodbnew";
// import User from "../../../../models/User";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { generateAuditTrailTest, validateEmail } from "../../../utils";

// async function loginUserFunc(obj) {
//   const { UT_User_Id, UT_Password } = obj;

//   try {
//     const user = await User.find({ UT_User_Id });

//     if (user?.length === 0) {
//       return false;
//     }

//     const isPasswordValid = await bcrypt.compare(
//       UT_Password,
//       user[0].UT_Password
//     );

//     if (!isPasswordValid) {
//       return false;
//     }

//     delete user[0].UT_Password;

//     return user;
//   } catch (error) {
//     console.log(error?.message, "login user error");
//     return false;
//   }
// }

// export async function POST(req) {
//   // Connect to database
//   await connectToDatabaseMongoose();

//   try {
//     const body = await req.json();
//     const user = await loginUserFunc(body);

//     if (!user) {
//       return NextResponse.json(
//         {
//           error: "Invalid user credentials!",
//           success: false,
//         },
//         { status: 400 }
//       );
//     }

//     // Generate new audit trail entry
//     const auditTrail = await generateAuditTrailTest(req);

//     // Push the new audit entry to UT_Audit_Trail
//     user.UT_Audit_Trail[0].push(auditTrail);
//     await user.save();

//     let obj = {
//       _id: user[0]?._id,
//       UT_User_Id: user[0]?.UT_User_Id,
//     };

//     let token = jwt.sign(obj, process.env.JWT_SECRET_KEY, {
//       expiresIn: "2 days",
//     });

//     return NextResponse.json(
//       {
//         message: "Login successful!",
//         data: { UT_User_Id: user.UT_User_Id, token },
//         success: true,
//         token,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error?.message, "Error while Loggin in.");
//     return NextResponse.json(
//       { message: error?.message, success: false },
//       { status: 500 }
//     );
//   }
// }


// app/api/auth/signin/route.js
import { NextResponse } from "next/server";
import connectToDatabaseMongoose from "../../../../shared/mongodbnew";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAuditTrailTest } from "../../../utils";

async function loginUserFunc(obj) {
  const { UT_User_Id, UT_Password } = obj;

  try {
    // Use findOne to retrieve a single user document
    const user = await User.findOne({ UT_User_Id });

    if (!user) {
      return null; // Return null if no user is found
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(UT_Password, user.UT_Password);

    if (!isPasswordValid) {
      return null; // Return null if the password is invalid
    }

    return user;
  } catch (error) {
    console.error("Login user error:", error?.message);
    return null; // Return null in case of an error
  }
}

export async function POST(req) {
  // Connect to the database
  await connectToDatabaseMongoose();

  try {
    // Parse the request body
    const body = await req.json();

    // Attempt to log in the user
    const user = await loginUserFunc(body);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid user credentials!",
          success: false,
        },
        { status: 400 }
      );
    }

    // Generate a new audit trail entry
    const auditTrail = await generateAuditTrailTest(req);

    // Use an update operation to add the audit trail entry
    await User.updateOne(
      { _id: user._id },
      { $push: { UT_Audit_Trail: auditTrail } }
    );

    // Create the JWT payload
    const payload = {
      _id: user._id,
      UT_User_Id: user.UT_User_Id,
    };

    // Generate a JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2 days",
    });

    // Return a success response
    return NextResponse.json(
      {
        message: "Login successful!",
        data: { UT_User_Id: user.UT_User_Id, token },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while logging in:", error?.message);
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
