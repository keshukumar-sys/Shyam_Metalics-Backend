const FamiliarModel = require("../Model/FamiliarModel");
const uploadtoS3 = require("../config/s3Uploader");

// CREATE familiar entry (append into array)
const createFamiliar = async (req, res) => {
  try {
    const { familiar_name, familiar_date } = req.body;

    // Validate required fields
    if (!familiar_name || !familiar_date || !req.file) {
      return res.status(400).json({
        message: "Please provide familiar_name, familiar_date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    // Push the new detail inside familiar_details array
    const updatedFamiliar = await FamiliarModel.findOneAndUpdate(
      {},
      {
        $push: {
          familiar_details: {
            familiar_name,
            familiar_date,
            familiar_file: fileUrl, // S3 URL saved here
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Familiar data added successfully",
      data: updatedFamiliar,
    });
  } catch (error) {
    console.error("Error creating Familiar:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET all familiar data
const getFamiliar = async (req, res) => {
  try {
    const familiarData = await FamiliarModel.findOne().sort({"familiar_details.familiar_date":-1});

    if (!familiarData) {
      return res.status(404).json({
        message: "No familiar details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Familiar data fetched successfully",
      data: familiarData.familiar_details,
    });
  } catch (error) {
    console.error("Error fetching Familiar:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createFamiliar, getFamiliar };
