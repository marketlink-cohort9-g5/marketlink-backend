const mongoose = require("mongoose");
const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    businessType: {
      type: String,
      enum: ["retailer", "wholesaler"],
      required: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    marketLocation: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    preferredCategory: [
      {
        type: String,
        trim: true,
      },
    ],
    verificationStatus: {
      type: String,
      enum: ["not_required", "pending", "approved", "rejected"],
      default: function () {
        return this.businessType === "wholesaler" ? "pending" : "not_required";
      },
    },
    pickupAvailable: {
      type: Boolean,
      default: false,
    },
    deliveryAvailable: {
      type: Boolean,
      default: false,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

//To prevent duplicate business profiles of the same type
businessSchema.index({ owner: 1, businessType: 1 }, { unique: true });
module.exports = mongoose.model("Business", businessSchema);
