const uploadToS3 = require("../config/s3Uploader");
const DisclosuresModel = require("../Model/DisclosuresModel")

const createDisclosures = async (req, res) => {
  const { name, date } = req.body;
  console.log("Received Disclosures:", req.body);
  console.log("Received file:", req.body.date);
  console.log("File info:", req.body.name);
  // validation
  if (!name|| !date) {
    return res.status(400).json({
      message: "Please provide Disclosures date, name, and file",
    });
  }

  const url = await uploadToS3(req.file, "diclosures");


  try {
    const updatedDisclosures = await DisclosuresModel.findOneAndUpdate(
      {}, // find first document
      {
        $push: {
          detail: {
            name,
            date,
            file:url,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Disclosures added successfully",
      data: updatedDisclosures,
    });
  } catch (error) {
    console.error("Error creating Disclosures:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
const getDisclosures = async (req, res) => {
  try {
    const DisclosuresData = await DisclosuresModel.findOne().sort({"detail.date":-1});

    if (!DisclosuresData) {
      return res.status(404).json({
        message: "No Disclosures details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Disclosures fetched successfully",
      data: DisclosuresData.detail,
    });
  } catch (error) {
    console.error("Error fetching Disclosures:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  createDisclosures,
  getDisclosures
}