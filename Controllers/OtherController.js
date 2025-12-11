const OtherModel = require("../Model/OtherModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create a new Other entry
const createOther = async (req, res) => {
  try {
    const { option, details } = req.body;

    if (!option || !details || !Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ message: "Option and details are required." });
    }

    // Handle file upload for each detail
    const uploadedDetails = await Promise.all(details.map(async (item, index) => {
      if (!item.name || !item.date) {
        throw new Error(`Detail at index ${index} is missing name or date`);
      }

      let fileUrl = "";
      if (req.files && req.files[index]) {
        fileUrl = await uploadtoS3(req.files[index]);
      } else if (item.file) {
        // Optional: If file is sent as URL/base64 in body
        fileUrl = item.file;
      }

      return {
        ...item,
        file: fileUrl
      };
    }));

    const newOther = await OtherModel.create({ option, details: uploadedDetails });

    res.status(201).json({ message: "Other record created successfully", data: newOther });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Other details
const getOtherDetails = async (req, res) => {
  try {
    const { option } = req.query;

    const filter = option ? { option } : {};

    const otherDetails = await OtherModel.find(filter).sort({ "details.date":-1 });
    res.status(200).json({ data: otherDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOther,
  getOtherDetails
};
