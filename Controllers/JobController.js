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

module.exports = {
    getAllJobs,
    addJob,
    updateJob,
    deleteJob,
    applyJob,
    getApplications
};
