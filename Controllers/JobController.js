const Job = require("../Model/JobModel")
const JobApplication = require("../Model/JobApplication");
const uploadToS3 = require("../config/s3Uploader");
// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error });
    }
};

// Add a new job (Admin)
const addJob = async (req, res) => {
    try {
        console.log("in the add job");
        const { title, description, location, salary } = req.body;
        const img = req.file ? req.file.filename : ""; // multer file
        const url = await uploadToS3(req.file, "jobs");
        const newJob = new Job({ title, description, location, img: url, salary });
        console.log(newJob);
        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Error creating job", error });
    }
};

// Update job
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location } = req.body;
        const img = req.file ? req.file.filename : undefined;
        const url = await uploadToS3(req.file, "jobs");
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { title, description, location, ...(img && { img }) },
            { new: true }
        );

        res.status(200).json({ message: "Job updated", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error });
    }
};

// Delete job
const deleteJob = async (req, res) => {
    try {
        const {id} = req.params;
        // console.log(id);
        await Job.findByIdAndDelete(id);
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error });
    }
};


/* ---------------- Apply Job ---------------- */
const applyJob = async (req, res) => {
  try {
    const data = req.body;

    let resumeUrl = "";
    if (req.file) {
      resumeUrl = await uploadToS3(req.file, "resumes");
    }

    const application = new JobApplication({
      jobId: data.jobId,

      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      cityState: data.cityState,
      linkedin: data.linkedin,

      totalExperience: data.totalExperience,
      currentCompany: data.currentCompany,
      designation: data.designation,
      department: data.department,
      currentCTC: data.currentCTC,
      expectedCTC: data.expectedCTC,
      noticePeriod: data.noticePeriod,

      positionAppliedFor: data.positionAppliedFor,
      preferredLocation: data.preferredLocation,
      employmentType: data.employmentType,

      qualification: data.qualification,
      specialization: data.specialization,
      institute: data.institute,
      yearOfCompletion: data.yearOfCompletion,

      resume: resumeUrl,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error applying to job",
      error,
    });
  }
};
/* ---------------- Update Application ---------------- */
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await JobApplication.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application updated successfully",
      application: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating application",
      error,
    });
  }
};
/* ---------------- Delete Application ---------------- */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await JobApplication.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting application",
      error,
    });
  }
};
/* -------- Get Applications For One Job -------- */
const getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const apps = await JobApplication.find({ jobId });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching job applications",
      error,
    });
  }
};

/* ---------------- Get Applications ---------------- */
const getApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find()
      .populate("jobId", "title location");

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching applications",
      error,
    });
  }
};
/* ---------------- Get All Job Applications (Admin) ---------------- */
const getAllJobApplications = async (req, res) => {
  try {
    console.log("get applications called");
    const applications = await JobApplication.find()
      .populate("jobId", "title location salary") // populate job info
      .sort({ createdAt: -1 }); // newest first
    console.log(applications);
    // Transform to clean response if needed
    const result = applications.map(app => ({
      id: app._id,
      fullName: app.fullName,
      email: app.email,
      mobile: app.mobile,
      cityState: app.cityState,
      linkedin: app.linkedin,
      totalExperience: app.totalExperience,
      currentCompany: app.currentCompany,
      designation: app.designation,
      department: app.department,
      currentCTC: app.currentCTC,
      expectedCTC: app.expectedCTC,
      noticePeriod: app.noticePeriod,
      positionAppliedFor: app.positionAppliedFor,
      preferredLocation: app.preferredLocation,
      employmentType: app.employmentType,
      qualification: app.qualification,
      specialization: app.specialization,
      institute: app.institute,
      yearOfCompletion: app.yearOfCompletion,
      resume: app.resume,
      status: app.status || "Applied",
      job: app.jobId ? {
        id: app.jobId._id,
        title: app.jobId.title,
        location: app.jobId.location,
        salary: app.jobId.salary
      } : null,
      appliedAt: app.createdAt
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching all job applications",
      error
    });
  }
};


module.exports = {
  getAllJobs,
  addJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplications,
  
  updateApplication,
  deleteApplication,
  getApplicationsByJobId,

  getAllJobApplications  // <-- new controller
};

