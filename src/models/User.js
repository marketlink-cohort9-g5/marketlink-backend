const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: /^\+234[789]\d{9}$/,
    },
    pinHash: {
      type: String,
      select: false,
    },
    roles: {
      type: [
        {
          type: String,
          enum: ["retailer", "wholesaler", "admin"],
        },
      ],
      required: true,
      validate: {
        validator: function (roles) {
          return roles.length > 0;
        },
        message: "At least one role is required",
      },
    },
    activeRole: {
      type: String,
      enum: ["retailer", "wholesaler", "admin"],
      required: true,
      validate: {
        validator: function (role) {
          return this.roles.includes(role);
        },
        message: "Invalid active role. It must be one of the user's roles.",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

//To Ensure atleast one signup identifier is provided
userSchema.pre("validate", function () {
  if (!this.email && !this.phoneNumber) {
    this.invalidate("email", "Email or phone number is required for signup.");
  }
});

module.exports = mongoose.model("User", userSchema);