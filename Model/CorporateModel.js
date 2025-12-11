const mongoose = require("mongoose");

const CorporateAnnouncementSchema = new mongoose.Schema(
  {
    option: {
      type: String,
      required: [true, "Please select an option"],
      enum: [
        "Newspaper Publication",
        "Press Release",
        "Notices",
        "Regulation 30 Disclosures",
      ],
    },
    details: [
      {
        name: {
          type: String,
          required: [true, "Please enter the name"],
        },
        date: {
          type: String,
          required: [true, "Please enter the date"],
        },
        file: {
          type: String,
          required: [true, "Please upload the file"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CorporateAnnouncementModel = mongoose.model(
  "CorporateAnnouncement",
  CorporateAnnouncementSchema
);
module.exports = CorporateAnnouncementModel;
