const OtherModel = require("../Model/OtherModel");
const uploadtoS3 = require("../config/s3Uploader");



const createOther = async (req, res) => {
  try {
    let newOtherEntry;

    const { option } = req.body;

    if (!option) {
      return res.status(400).json({ message: "Option is required" });
    }

    // ===================== OTHER COMPLIANCES =====================
    if (option === "Other Compliances") {
      if (!req.body.details || !req.file) {
        return res.status(400).json({
          message: "Details and file are required for Other Compliances",
        });
      }

      const parsedDetails = JSON.parse(req.body.details);

      if (!parsedDetails.name || !parsedDetails.date) {
        return res.status(400).json({
          message: "Name and date are required",
        });
      }

      const fileUrl = await uploadtoS3(req.file);

      newOtherEntry = new OtherModel({
        option,
        details: {
          ...parsedDetails,
          file: fileUrl,
        },
      });
    }

    // ===================== CONTACT DETAILS =====================
    else if (
      option === "KMP Contact Details" ||
      option === "Investor Relations Contact"
    ) {
      const { details } = req.body;

      if (!Array.isArray(details) || !details[0]?.contactInfo) {
        return res.status(400).json({
          message: "Contact details are required",
        });
      }

      newOtherEntry = new OtherModel({
        option,
        details: {
          ...details[0], // { contactInfo }
        },
      });
    }

    // ===================== INVALID OPTION =====================
    else {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    await newOtherEntry.save();

    res.status(201).json({
      message: "Other entry created successfully",
      data: newOtherEntry,
    });
  } catch (error) {
    console.error("Error creating Other entry:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Other details
const getOtherDetails = async (req, res) => {
  try {
    const { option } = req.query;

    const filter = option ? { option } : {};

    const otherDetails = await OtherModel.find(filter).sort({ "details.date": -1 });
    res.status(200).json({ data: otherDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id is required" });

    const parent = await OtherModel.findOne({ "details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });

    await OtherModel.updateOne({ _id: parent._id }, { $pull: { details: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOther,
  getOtherDetails,
  deleteById,
};
