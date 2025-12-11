const mongoose = require("mongoose");

const InvestorAnalystSchema = new mongoose.Schema(
    {
        investor_analyst_details: [
            {
                investor_analyst_name: {
                    type: String,
                    required: [true, "Please enter the familiar name"],
                },
                investor_analyst_date: {
                    type: Date,
                    required: [true, "Please enter the familiar date"],
                },
                investor_analyst_file: {
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

const InvestorAnalyst = mongoose.model("InvestorAnalyst", InvestorAnalystSchema);
module.exports = InvestorAnalyst;
