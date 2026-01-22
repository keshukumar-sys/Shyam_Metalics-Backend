const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    companyName: {
      type: String,
    },
    classification: {
      type: String,
    },
    industry: {
      type: String,
    },
    country: {
      type: String,
      default: "India",
    },
    phone: {
      type: String,
    },
    inquiryMessage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"], // ✅ options
      default: "Pending",
    },
  },
  { timestamps: true }
);

const ContactModel = mongoose.model("Contact", contactSchema);
module.exports = ContactModel;
