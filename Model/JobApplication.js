// models/JobApplication.js
const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },

  // Basic Info
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  cityState: { type: String },
  linkedin: { type: String },

  // Professional Details
  totalExperience: { type: String },
  currentCompany: { type: String },
  designation: { type: String },
  department: { type: String },
  currentCTC: { type: String },
  expectedCTC: { type: String },
  noticePeriod: { type: String },

  // Job Preference
  positionAppliedFor: { type: String },
  preferredLocation: { type: String },
  employmentType: {
    type: String,
    enum: ["Full-time", "Contract", "Internship"],
  },

  // Education
  qualification: { type: String },
  specialization: { type: String },
  institute: { type: String },
  yearOfCompletion: { type: String },

  // Resume
  resume: { type: String },

  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
