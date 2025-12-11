const mongoose = require('mongoose');

const InvestorInformationSchema = new mongoose.Schema({
    option: {
        type: String, 
        required: [true, "Please select at least and at most 1 type"],
        enum: ["Credit Rating", "Postal Ballot", "AGM"]
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
}, {
    timestamps: true
});

const InvestorInformationModel = mongoose.model("InvestorInformation", InvestorInformationSchema);
module.exports = InvestorInformationModel;
