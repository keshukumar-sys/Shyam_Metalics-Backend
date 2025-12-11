const mongoose = require("mongoose");

const SebiSchema = new mongoose.Schema(
  {
    sebi_details: [
      {
        sebi_name: {
          type: String,
          required: [true, "Please enter the sebi name"],
        },
        sebi_date: {
          type: String,
          required: [true, "Please Enter the sebi date"],
        },
        sebi_file: {
          type: String,
          required: [true, "Please enter the sebi file data"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const sebiModel = mongoose.model("SEBI", SebiSchema);
module.exports = sebiModel;
