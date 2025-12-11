const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema(
  {
    policyDetail: [
      {
        policy_name: {
          type: String,
          required: [true, "please mention policy name"],
        },
        policy_date: {
          type: Date,
          required: [true, "please mention policy date"],
        },
        policy_file: {
          type: String,
          required: [true, "please mention policy file"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PolicyModel = mongoose.model("Policy", PolicySchema);
module.exports = PolicyModel;
