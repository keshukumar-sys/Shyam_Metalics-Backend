const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} = require("../Controllers/ContactController");

router.post("/", createInquiry);
router.get("/", getAllInquiries);
router.get("/:id", getInquiryById);
router.patch("/:id/status", updateInquiryStatus); // ✅ only status
router.delete("/:id", deleteInquiry);

module.exports = router;
