// models/User.js
import mongoose from "mongoose";
import { validateEmail } from "../app/utils";

// Schema for the location object
const LocationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  region: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  timezone: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

// Schema for each audit trail entry
const AuditTrailSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
  browser: { type: String, required: true },
  os: { type: String, required: true },
  device: { type: String, default: "Unknown" },
  location: { type: LocationSchema, required: true },
});

// Main User schema
const UserSchema = new mongoose.Schema(
  {
    UT_UserId: {
      type: String,
      unique: true,
      sparse: true,
    },

    UT_User_Id: { type: String, required: true, unique: true },

    UT_User_Num: { type: Number, unique: true },

    UT_User_Status: { type: Number, default: 4 },

    UT_Product_Enabled: { type: String, default: "10000" },

    UT_Login_Type: { type: Number },

    UT_Email: {
      type: String,
      sparse: true,
    },

    UT_Phone: {
      type: String,
      sparse: true,
    },

    UT_LinkedIn_Id: { type: String },

    UT_Voice: { type: mongoose.Schema.Types.Mixed },

    UT_Apple: { type: String },

    UT_Meta: { type: String },

    UT_Google: { type: String },

    UT_Biometric_Id: { type: mongoose.Schema.Types.Mixed },

    UT_Password: { type: String, required: true },

    UT_Creation_DtTym: {
      type: String,
      default: () => new Date().toISOString(),
    },

    UT_Audit_Trail: {
      type: [AuditTrailSchema],
      default: [],
    },

    UT_TimeStamp: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to populate `UT_UserId` and auto-increment `UT_User_Num`
UserSchema.pre("save", async function (next) {
  // Ensure `UT_UserId` is assigned
  if (!this.UT_UserId) {
    this.UT_UserId = this._id.toString(); // Assign `_id` to `UT_UserId`
  }

  // Check if `UT_UserId` is null or undefined
  if (!this.UT_UserId) {
    return next(new Error("UT_UserId cannot be null or undefined."));
  }

  // Validate and assign `UT_Email` or `UT_Phone` based on `UT_User_Id`
  if (validateEmail(this.UT_User_Id)) {
    this.UT_Email = this.UT_User_Id;
    this.UT_Phone = null; // Ensure phone is null if it's an email
  } else {
    this.UT_Phone = this.UT_User_Id;
    this.UT_Email = null; // Ensure email is null if it's a phone number
  }

  // Check if `UT_User_Id` is unique
  const existingUser = await mongoose
    .model("user_table")
    .findOne({ UT_User_Id: this.UT_User_Id });
  if (existingUser && existingUser._id.toString() !== this._id.toString()) {
    return next(new Error("UT_User_Id already exists."));
  }

  // Auto-increment `UT_User_Num`
  if (!this.UT_User_Num) {
    const lastUser = await mongoose
      .model("user_table")
      .findOne()
      .sort({ UT_User_Num: -1 });
    this.UT_User_Num = lastUser ? lastUser.UT_User_Num + 1 : 1; // If no user exists, set UT_User_Num to 1
  }

  // Ensure `UT_Creation_DtTym` is set properly
  if (!this.UT_Creation_DtTym) {
    this.UT_Creation_DtTym = new Date().toISOString(); // Use current date and time if not provided
  }

  // Conditional validation for fields based on `UT_Login_Type`
  const loginType = this.UT_Login_Type;
  if (loginType === 3 && !this.UT_LinkedIn_Id) {
    return next(new Error("UT_LinkedIn_Id is required for UT_Login_Type 03"));
  }
  if (loginType === 4 && !this.UT_Voice) {
    return next(new Error("UT_Voice is required for UT_Login_Type 04"));
  }
  if (loginType === 5 && !this.UT_Apple) {
    return next(new Error("UT_Apple is required for UT_Login_Type 05"));
  }
  if (loginType === 6 && !this.UT_Meta) {
    return next(new Error("UT_Meta is required for UT_Login_Type 06"));
  }
  if (loginType === 7 && !this.UT_Google) {
    return next(new Error("UT_Google is required for UT_Login_Type 07"));
  }
  if (loginType === 8 && !this.UT_Biometric_Id) {
    return next(new Error("UT_Biometric_Id is required for UT_Login_Type 08"));
  }

  next();
});

const User =
  mongoose.models.USER_TABLES || mongoose.model("user_table", UserSchema);

export default User;
