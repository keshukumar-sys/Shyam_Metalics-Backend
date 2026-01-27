const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer

const {
  getAllJobs,
  addJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplications,
  updateApplication,
  deleteApplication,
  getApplicationsByJobId,
  getAllJobApplications // <-- new
} = require("../Controllers/JobController");

// ========================
// EXISTING ROUTES (unchanged)
// ========================
router.get("/test", (req, res) => res.send("Jobs API is running"));
router.get("/all", getAllJobs);
router.post("/add", upload.single("img"), addJob);
router.put("/update/:id", upload.single("img"), updateJob);
router.delete("/delete/:id", (req, res, next) => {
  console.log("in the next route");
  next();
}, deleteJob);
router.get("/applications/:jobId", getApplications);
router.post("/apply", upload.single("resume"), applyJob);
router.get("/applications/job/:jobId", getApplicationsByJobId);
router.put("/applications/update/:id", updateApplication);
router.delete("/applications/delete/:id", deleteApplication);

// ========================
// NEW ADMIN ROUTE
// ========================
// Get all job applications for dashboard/admin
router.get("/applications/all", getAllJobApplications);

module.exports = router;
