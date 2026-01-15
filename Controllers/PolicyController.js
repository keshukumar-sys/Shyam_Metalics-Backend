const PolicyModel = require("../Model/PoliciesModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create Policy Controller
const createPolicy = async (req, res) => {
  try {
    const { policy_name, policy_date } = req.body;

    // Validate
    if (!policy_name || !policy_date) {
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
    const policyData = await PolicyModel.findOne();

    if (!policyData || !policyData.policyDetail || policyData.policyDetail.length === 0) {
      return res.status(404).json({
        message: "No policies found",
        data: [],
      });
    }

    const sortedPolicies = policyData.policyDetail.sort((a, b) =>
      a.policy_name.localeCompare(b.policy_name)
    );

    res.status(200).json({
      message: "Policies fetched successfully",
      data: sortedPolicies,
    });
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteById = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "id is required" });
  try {
    const parent = await PolicyModel.findOne({ "policyDetail._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await PolicyModel.updateOne({ _id: parent._id }, { $pull: { policyDetail: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const updatePolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { policy_name, policy_date } = req.body;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const parent = await PolicyModel.findOne({ "policyDetail._id": id });
    if (!parent) {
      return res.status(404).json({ message: "Policy not found" });
    }

    const updateFields = {};

    if (policy_name) {
      updateFields["policyDetail.$.policy_name"] = policy_name;
    }

    if (policy_date) {
      updateFields["policyDetail.$.policy_date"] = policy_date;
    }

    if (req.file) {
      const fileUrl = await uploadtoS3(req.file);
      updateFields["policyDetail.$.policy_file"] = fileUrl;
    }

    const updatedPolicy = await PolicyModel.findOneAndUpdate(
      { "policyDetail._id": id },
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      message: "Policy updated successfully",
      data: updatedPolicy,
    });

  } catch (error) {
    console.error("Error updating policy:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createPolicy, getAllPolicies, deleteById, updatePolicyById };