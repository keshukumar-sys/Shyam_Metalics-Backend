const mongoose = require('mongoose');

const ContactDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    office: { type: String },
    company: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String }
});

const OtherSchema = new mongoose.Schema({
    option: {
        type: String,
        required: [true, "Please select at least and at most 1 type"],
        enum: ["Other Compliances", "KMP Contact Details", "Investor Relations Contact"]
    },
    details: [
        {
            name: { type: String },
            date: { type: Date },
            file: { type: String },
            contactInfo: {
                type: ContactDetailsSchema,
                required: function() {
                    return this.option === "KMP Contact Details" || this.option === "Investor Relations Contact";
                }
            }
        }
    ]
}, {
    timestamps: true
});

const OtherModel = mongoose.model("Other", OtherSchema);
module.exports = OtherModel;
