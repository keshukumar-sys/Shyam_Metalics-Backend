const InvestorInformationModel = require("../Model/InvestorInformationModel");
const uploadtoS3 = require("../config/s3Uploader");

// Add / Append Investor Information Details for selected option
const addInvestorInformationDetail = async (req, res) => {
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
    const updatedInvestorInformation = await InvestorInformationModel.findOneAndUpdate(
      { option },
      {
        $push: {
          details: {
            name,
            date,
            file: fileUrl, // S3 URL instead of filename
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: `${option} detail added successfully`,
      data: updatedInvestorInformation,
    });
  } catch (error) {
    console.error("Error adding Investor information detail:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all Investor Information Details for selected option
const getInvestorInformationDetails = async (req, res) => {
  const { option } = req.params;

  try {
    const InvestorInformationData = await InvestorInformationModel.findOne({ option }).sort({"details.date":-1});

    if (!InvestorInformationData) {
      return res.status(404).json({
        message: `No investor details found for ${option}`,
        data: [],
      });
    }

    res.status(200).json({
      message: `${option} details fetched successfully`,
      data: InvestorInformationData.details,
    });
  } catch (error) {
    console.error("Error fetching investor information details:", error);
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
    const parent = await InvestorInformationModel.findOne({ "details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await InvestorInformationModel.updateOne({ _id: parent._id }, { $pull: { details: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addInvestorInformationDetail, getInvestorInformationDetails, deleteById };
