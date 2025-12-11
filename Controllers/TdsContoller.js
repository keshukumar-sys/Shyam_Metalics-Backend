const uploadToS3 = require("../config/s3Uploader");
const TdsModel = require("../Model/TdsDeclarationModel");

const createTds = async (req, res) => {
  const { tds_name, tds_date, tds_file } = req.body;

  // validation
  if (!tds_name || !tds_date || !tds_file) {
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



module.exports = {
  createTds,
  getTds
}