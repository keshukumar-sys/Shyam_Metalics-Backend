const StockExchangeComplianceModel = require("../Model/StockExchangeComplianceModel");
const uploadtoS3 = require("../config/s3Uploader");

// Add / Append details for selected option
const addComplianceDetail = async (req, res) => {
  try {
    const { option, name, date } = req.body;

    if (!option || !name || !date || !req.file) {
      return res.status(400).json({
        message: "Please provide option, name, date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    // Save in DB
    const updatedCompliance = await StockExchangeComplianceModel.findOneAndUpdate(
      { option },
      { $push: { details: { name, date, file: fileUrl } } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: `${option} detail added successfully`,
      data: updatedCompliance,
    });
  } catch (error) {
    console.error("Error adding compliance detail:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all details for a selected option
const getComplianceDetails = async (req, res) => {
  const { option } = req.params;

  try {
    const complianceData = await StockExchangeComplianceModel.findOne({ option }).sort({"details.date":-1});;

    if (!complianceData) {
      return res.status(404).json({
        message: `No data found for ${option}`,
        data: [],
      });
    }

    res.status(200).json({
      message: `${option} details fetched successfully`,
      data: complianceData.details,
    });
  } catch (error) {
    console.error("Error fetching compliance details:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { addComplianceDetail, getComplianceDetails };
