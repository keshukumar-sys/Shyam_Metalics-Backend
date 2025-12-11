const mongoose = require("mongoose");

const FamiliarSchema = new mongoose.Schema(
  {
    familiar_details: [
      {
        familiar_name: {
          type: String,
          required: [true, "Please enter the familiar name"],
        },
        familiar_date: {
          type: String,
          required: [true, "Please enter the familiar date"],
        },
        familiar_file: {
          type: String,
          required: [true, "Please upload the familiar file"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FamiliarModel = mongoose.model("FAMILIAR", FamiliarSchema);
module.exports = FamiliarModel;
