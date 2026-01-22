const ContactModel = require("../Model/contactModel");

/**
 * CREATE Inquiry
 */
const createInquiry = async (req, res) => {
  try {
    const inquiry = await ContactModel.create(req.body);
    console.log(inquiry)
    res.status(201).json({
      success: true,
      message: "Inquiry created successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create inquiry",
      error: error.message,
    });
  }
};

/**
 * GET All Inquiries
 */
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await ContactModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
};

/**
 * GET Single Inquiry
 */
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await ContactModel.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry",
      error: error.message,
    });
  }
};

/**
 * UPDATE ONLY STATUS
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status);
    // console.log(updateInquiryStatus);
    const allowedStatus = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatus.join(", ")}`,
      });
    }

    const inquiry = await ContactModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

/**
 * DELETE Inquiry
 */
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await ContactModel.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete inquiry",
      error: error.message,
    });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};
