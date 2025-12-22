const express = require('express');
const { createEventNews, getAllEventNews, deleteById } = require('../Controllers/EventNews');
const router = express.Router();
const upload = require("../middleware/upload");
router.post('/event-news', upload.single("image"), createEventNews);
router.get('/event-news', getAllEventNews);
router.delete("/delete" , deleteById);
module.exports = router;