const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer

const {
  getAllJobs,
  addJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplications
} = require("../Controllers/JobController");

// Test route
router.get("/test", (req, res) => res.send("Jobs API is running"));

// Get all jobs
router.get("/all", getAllJobs);

// Admin: Create a job
router.post("/add", upload.single("img"), addJob);

// Admin: Update a job
router.put("/update/:id", upload.single("img"), updateJob);

// Admin: Delete a job
router.delete("/delete/:id",(req,res ,next)=>{
  console.log("in the next route");
  next();
} ,deleteJob);
router.get("/applications/:jobId", getApplications);
// Candidate: Apply to job
router.post("/apply", upload.single("resume"), applyJob);

module.exports = router;
