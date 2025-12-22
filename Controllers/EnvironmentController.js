const EnvironmentModel = require("../Model/EnvironmentModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create Environment Entry
const createEnvironment = async (req, res) => {
  try {
    const { detail_name, detail_date } = req.body;

    // Validate required fields
    if (!detail_name || !detail_date || !req.file) {
      return res.status(400).json({
        message: "Please provide detail_name, detail_date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    const updatedEnvironment = await EnvironmentModel.findOneAndUpdate(
      {}, // find the first environment document
      {
        $push: {
          environment_detail: {
            detail_name,
            detail_date,
            detail_file: fileUrl,   // store S3 file URL
          },
        },
      },
      { new: true, upsert: true } // create doc if it doesn't exist
    );

    res.status(201).json({
      message: "Environment added successfully",
      data: updatedEnvironment,
    });

  } catch (error) {
    console.error("Error creating environment:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};



// Fetch Environment
const getEnvironment = async (req, res) => {
  try {
    const environmentData = await EnvironmentModel.findOne().sort({"environment_detail.detail_date":-1});

    if (!environmentData) {
      return res.status(404).json({
        message: "No environment found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Environment fetched successfully",
      data: environmentData.environment_detail,
    });

  } catch (error) {
    console.error("Error fetching environment:", error);
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
    const parent = await EnvironmentModel.findOne({ "environment_detail._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await EnvironmentModel.updateOne({ _id: parent._id }, { $pull: { environment_detail: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEnvironment,
  getEnvironment,
  deleteById,
};
