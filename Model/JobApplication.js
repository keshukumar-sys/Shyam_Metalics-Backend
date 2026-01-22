const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: { type: String }, // optional file path
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
