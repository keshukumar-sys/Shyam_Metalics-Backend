const sebiModel = require("../Model/SebiOnlineDisputeModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create SEBI entry
const createSebi = async (req, res) => {
  try {
    const { sebi_name, sebi_date } = req.body;

    // Validate
    if (!sebi_name || !sebi_date || !req.file) {
      return res.status(400).json({
        message: "Please provide sebi_name, sebi_date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    // Save in DB
    const updatedSebi = await sebiModel.findOneAndUpdate(
      {},
      {
        $push: {
          sebi_details: {
            sebi_name,
            sebi_date,
            sebi_file: fileUrl, // store S3 URL
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "SEBI data added successfully",
      data: updatedSebi,
    });
  } catch (error) {
    console.error("Error creating SEBI:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get SEBI details
const getSebi = async (req, res) => {
  try {
    const sebiData = await sebiModel.findOne().sort({"sebi_details.sebi_date":-1});

    if (!sebiData) {
      return res.status(404).json({
        message: "No SEBI details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "SEBI fetched successfully",
      data: sebiData.sebi_details,
    });
  } catch (error) {
    console.error("Error fetching SEBI:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createSebi, getSebi };
