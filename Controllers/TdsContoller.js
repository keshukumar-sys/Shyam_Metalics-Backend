const uploadToS3 = require("../config/s3Uploader");
const TdsModel = require("../Model/TdsDeclarationModel");

const createTds = async (req, res) => {
  const { tds_name, tds_date } = req.body;
  // validation
  if (!tds_name || !tds_date) {
    return res.status(400).json({
      message: "Please provide tds_name, tds_date, and tds_file",
    });
  }

  const url = await uploadToS3(req.file, "tds");


  try {
    const updatedTds = await TdsModel.findOneAndUpdate(
      {}, // find first document
      {
        $push: {
          tds_details: {
            tds_name,
            tds_date,
            tds_file:url,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "TDS added successfully",
      data: updatedTds,
    });
  } catch (error) {
    console.error("Error creating TDS:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
const getTds = async (req, res) => {
  try {
    const tdsData = await TdsModel.findOne().sort({"tds_details.tds_date":-1});

    if (!tdsData) {
      return res.status(404).json({
        message: "No TDS details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "TDS fetched successfully",
      data: tdsData.tds_details,
    });
  } catch (error) {
    console.error("Error fetching TDS:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
async function deleteById(req, res) {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "id is required" });
  try {
    const parent = await TdsModel.findOne({ "tds_details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await TdsModel.updateOne({ _id: parent._id }, { $pull: { tds_details: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

const updateTdsById = async (req, res) => {
  try {
    const { id } = req.params; // _id of the tds_detail
    const { tds_name, tds_date } = req.body;

    if (!id) return res.status(400).json({ message: "id is required" });

    const parent = await TdsModel.findOne({ "tds_details._id": id });
    if (!parent) return res.status(404).json({ message: "TDS detail not found" });

    const updateFields = {};

    if (tds_name) updateFields["tds_details.$.tds_name"] = tds_name;
    if (tds_date) updateFields["tds_details.$.tds_date"] = tds_date;
    if (req.file) {
      const fileUrl = await uploadToS3(req.file, "tds");
      updateFields["tds_details.$.tds_file"] = fileUrl;
    }

    const updatedTds = await TdsModel.findOneAndUpdate(
      { "tds_details._id": id },
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      message: "TDS detail updated successfully",
      data: updatedTds,
    });
  } catch (error) {
    console.error("Error updating TDS detail:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createTds,
  getTds,
  deleteById,
  updateTdsById
}

