const FinancialModel = require("../Model/FinancialModel");
const uploadtoS3 = require("../config/s3Uploader");

// Add / Append Financial Details for selected option
const addFinancialDetail = async (req, res) => {
  try {
    const { option, name, date } = req.body;

    // Validation
    if (!option || !name || !date || !req.file) {
      return res.status(400).json({
        message: "Please provide option, name, date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    // Save in DB
    const updatedFinancial = await FinancialModel.findOneAndUpdate(
      { option },
      {
        $push: {
          details: {
            name,
            date,
            file: fileUrl // save S3 URL
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: `${option} detail added successfully`,
      data: updatedFinancial,
    });

  } catch (error) {
    console.error("Error adding financial detail:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all Financial Details for selected option
const getFinancialDetails = async (req, res) => {
  const { option } = req.params;

  try {
    const financialData = await FinancialModel.findOne({ option }).sort({ "details.date": -1 });
    console.log(financialData);
    const updatedData = financialData.details.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ); 
    
    if (!financialData) {
      return res.status(404).json({
        message: `No financial details found for ${option}`,
        data: [],
      });
    }

    res.status(200).json({
      message: `${option} details fetched successfully`,
      data: updatedData,
    });
  } catch (error) {
    console.error("Error fetching financial details:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { addFinancialDetail, getFinancialDetails };
