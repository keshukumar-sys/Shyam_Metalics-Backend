const PolicyModel = require("../Model/PoliciesModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create Policy Controller
const createPolicy = async (req, res) => {
  try {
    const { policy_name, policy_date } = req.body;

    // Validate
    if (!policy_name || !policy_date || !req.file) {
      return res.status(400).json({
        message: "Please provide policy_name, policy_date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    // Push (append) inside array
    const updatedPolicy = await PolicyModel.findOneAndUpdate(
      {}, // find first document
      {
        $push: {
          policyDetail: {
            policy_name,
            policy_date,
            policy_file: fileUrl, // store S3 URL
          },
        },
      },
      { new: true, upsert: true } // create if not exists
    );

    res.status(201).json({
      message: "Policy added successfully",
      data: updatedPolicy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all Policies
const getAllPolicies = async (req, res) => {
  try {
    const policyData = await PolicyModel.findOne().sort({"policyDetails.policy_date":-1});

    if (!policyData) {
      return res.status(404).json({
        message: "No policies found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Policies fetched successfully",
      data: policyData.policyDetail,
    });
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createPolicy, getAllPolicies };
