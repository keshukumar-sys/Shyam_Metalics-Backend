const QIPModel = require("../Model/QipModel");
const { uploadtoS3 } = require("../config/s3Uploader");

const createQip = async (req, res) => {
  try {
    const { qip_name, qip_date } = req.body;

    if (!qip_name || !qip_date) {
      return res.status(400).json({
        message: "Please provide qip_name and qip_date",
      });
    }

    let qip_file = null;

    if (req.file) {
      qip_file = await uploadtoS3(
        req.file,
        `QIP/${Date.now()}_${req.file.originalname}`
      );
    }

    const newQip = new QIPModel({
      qip_name,
      qip_date,
      qip_file,
    });

    const result = await newQip.save();
    res.status(201).json({
      message: "QIP created successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error creating QIP",
    });
  }
};

const getQip = async (req, res) => {
  try {
    const qipData = await QIPModel.find();

    if (!qipData || qipData.length === 0) {
      return res.status(404).json({
        message: "No QIP found",
        data: [],
      });
    }

    res.status(200).json({
      message: "QIP retrieved successfully",
      data: qipData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error retrieving QIP",
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await QIPModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        message: "QIP not found",
      });
    }

    res.status(200).json({
      message: "QIP deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error deleting QIP",
    });
  }
};

const updateQipById = async (req, res) => {
  try {
    const { id } = req.params;
    const { qip_name, qip_date } = req.body;

    const qipData = await QIPModel.findById(id);

    if (!qipData) {
      return res.status(404).json({
        message: "QIP not found",
      });
    }

    if (qip_name) qipData.qip_name = qip_name;
    if (qip_date) qipData.qip_date = qip_date;

    if (req.file) {
      const qip_file = await uploadtoS3(
        req.file,
        `QIP/${Date.now()}_${req.file.originalname}`
      );
      qipData.qip_file = qip_file;
    }

    const result = await qipData.save();

    res.status(200).json({
      message: "QIP updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error updating QIP",
    });
  }
};

module.exports = {
  createQip,
  getQip,
  deleteById,
  updateQipById,
};
