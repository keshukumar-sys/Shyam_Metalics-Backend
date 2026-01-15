const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {createEventsStories, getEventStories, deleteById , updateEventStories} = require("../Controllers/EventsStoriesController");

router.post("/create_event_story", upload.single("front_image"), createEventsStories);
router.get("/get_event_stories", getEventStories);
router.delete("/delete" , deleteById);
router.put("/update_event_story/:id", upload.single("front_image"), updateEventStories);

module.exports = router;