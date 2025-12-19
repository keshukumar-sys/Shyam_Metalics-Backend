const express = require('express');
const { createEventNews, getAllEventNews } = require('../Controllers/EventNews');
const router = express.Router();
const upload = require("../middleware/upload");
router.post('/event-news', upload.single("image"), createEventNews);
router.get('/event-news', getAllEventNews);
module.exports = router;