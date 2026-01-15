const mongoose = require("mongoose");

const qipSchema = new mongoose.Schema(
  {
    qip_name: {
      type: String,
      required: true,
    },
    qip_date: {
      type: Date,
      required: true,
    },
    qip_file: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QIP", qipSchema);
