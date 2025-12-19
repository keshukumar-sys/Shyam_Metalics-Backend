const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {createEventsStories, getEventStories} = require("../Controllers/EventsStoriesController");

router.post("/create_event_story", upload.single("front_image"), createEventsStories);
router.get("/get_event_stories", getEventStories);
module.exports = router;