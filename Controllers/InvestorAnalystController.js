const InvestorAnalyst = require("../Model/InvestorAnlystModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create / Add investor analyst details
const createInvestorAnalyst = async (req, res) => {
  try {
    const { investor_analyst_name, investor_analyst_date } = req.body;

    // Validate fields
    if (!investor_analyst_name || !investor_analyst_date || !req.file) {
      return res.status(400).json({
        message: "Please provide investor_analyst_name, investor_analyst_date, and file",
      });
    }

    // Upload file to S3
    const fileUrl = await uploadtoS3(req.file);

    // Save in DB
    const updatedInvestorAnalyst = await InvestorAnalyst.findOneAndUpdate(
      {}, 
      {
        $push: {
          investor_analyst_details: {
            investor_analyst_name,
            investor_analyst_date,
            investor_analyst_file: fileUrl, // Save S3 URL
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Investor/Analyst data added successfully",
      data: updatedInvestorAnalyst,
    });

  } catch (error) {
    console.error("Error creating Investor/Analyst:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get investor analyst details
const getInvestorAnalyst = async (req, res) => {
  try {
    const investorAnalystData = await InvestorAnalyst.findOne().sort({"investor_analyst_details.investor_analyst_date":-1});
    if (!investorAnalystData) {
      return res.status(404).json({
        message: "No Investor/Analyst details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Investor/Analyst fetched successfully",
      data: investorAnalystData.investor_analyst_details,
    });

  } catch (error) {
    console.error("Error fetching Investor/Analyst:", error);
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
    const parent = await InvestorAnalyst.findOne({ "investor_analyst_details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await InvestorAnalyst.updateOne({ _id: parent._id }, { $pull: { investor_analyst_details: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createInvestorAnalyst, getInvestorAnalyst, deleteById };
