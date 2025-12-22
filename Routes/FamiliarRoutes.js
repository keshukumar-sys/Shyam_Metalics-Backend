const express = require("express");
const { createFamiliar, getFamiliar, deleteById } = require("../Controllers/FamiliarController");
const upload = require("../middleware/upload");

const router = express.Router();

// Test route
router.get("/f", (req, res) => {
  res.send("Welcome to the Familiar route");
});

// Create familiar item
router.post("/add_familiar",upload.single("file"), createFamiliar);

// Get all familiar data
router.get("/get_familiar", getFamiliar);
router.delete("/delete" , deleteById);

module.exports = router;
