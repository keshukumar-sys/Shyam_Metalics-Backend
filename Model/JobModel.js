const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  img: { type: String, required: true }, // store image path
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary:{type:String , required:true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
