const CorporateAnnouncementModel = require("../Model/CorporateModel");
const uploadtoS3 = require("../config/s3Uploader");
// Add / Append details for selected option
const addCorporateAnnouncement = async (req, res) => {
  try {
    const { option, name, date } = req.body;

    if (!option || !name || !date || !req.file) {
      return res.status(400).json({
        message: "Please provide option, name, date, and file",
      });
    }

    // Upload to S3
    const fileUrl = await uploadtoS3(req.file);

    const updatedAnnouncement = await CorporateAnnouncementModel.findOneAndUpdate(
      { option },
      {
        $push: {
          details: {
            name,
            date,
            file: fileUrl   // STORE S3 URL
          }
        }
      },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      message: `${option} added successfully`,
      data: updatedAnnouncement,
    });

  } catch (error) {
    console.error("Error adding announcement:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all details for a specific option
const getCorporateAnnouncement = async (req, res) => {
  const { option } = req.params;

  try {
    const announcementData = await CorporateAnnouncementModel.findOne({ option }).sort({"details.date":-1});

    if (!announcementData) {
      return res.status(404).json({
        message: `No data found for ${option}`,
        data: [],
      });
    }

    res.status(200).json({
      message: `${option} fetched successfully`,
      data: announcementData.details,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
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
    const parent = await CorporateAnnouncementModel.findOne({ "details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await CorporateAnnouncementModel.updateOne(
      { _id: parent._id },
      { $pull: { details: { _id: id } } }
    );
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addCorporateAnnouncement, getCorporateAnnouncement, deleteById };
