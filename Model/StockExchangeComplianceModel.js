const mongoose = require("mongoose");

const StockExchangeComplianceSchema = new mongoose.Schema(
  {
    option: {
      type: String,
      required: [true, "Please select an option"],
      enum: [
        "Shareholding Pattern",
        "Corporate Governance Report",
        "Reconciliation Share Capital Audit Report",
        "Investors Grievances Report",
        "Integrated Financials",
        "Integrated Governance",
        "Regulation 74(5)",
        "Regulation 40(9)",
        "Regulation 7(3)",
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

const StockExchangeComplianceModel = mongoose.model(
  "StockExchangeCompliance",
  StockExchangeComplianceSchema
);

module.exports = StockExchangeComplianceModel;
