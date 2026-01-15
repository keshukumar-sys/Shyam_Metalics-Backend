const express = require('express');
const { createEventNews, getAllEventNews, deleteById , updateEventNews } = require('../Controllers/EventNews');
const router = express.Router();
const upload = require("../middleware/upload");
router.post('/event-news', upload.single("image"), createEventNews);
router.get('/event-news', getAllEventNews);
router.delete("/delete" , deleteById);
router.delete("/:id", deleteById);
router.put("/update_event_news/:id", upload.single("image"), updateEventNews);

module.exports = router;