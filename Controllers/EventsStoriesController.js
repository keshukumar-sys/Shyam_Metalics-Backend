const uploadtoS3 = require("../config/s3Uploader");
const EventStories = require("../Model/AwardStories");
const createEventsStories = async (req, res) => {
    try {
        console.log("HEADERS:", req.headers["content-type"]);
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const { name, slug, short_description, event_start_date, event_end_date, event_location, event_type} = req.body;
        if (!name || !slug || !short_description || !event_start_date || !event_end_date || !event_location || !event_type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let parsedEventLocation;
        let parsedEventType;    
        try {
            parsedEventLocation = JSON.parse(event_location);
            parsedEventType = JSON.parse(event_type);
            

        } catch {
            return res.status(400).json({ message: "Invalid content JSON" });
        }
        const imageUrl = await uploadtoS3(req.file, "event-news");
        const newEventStories = new EventStories({
            name,
            slug,
            short_description,  
            event_start_date,
            event_end_date,
            event_location: parsedEventLocation,
            event_type: parsedEventType,
            front_image: {url:imageUrl}
        });
        await newEventStories.save();
        return res.status(201).json({
            message: "Event Stories created successfully",
            data: newEventStories
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }

};

const getEventStories = async (req, res) => {
    {
        try {
            const eventStoriesList = await EventStories.find().sort({ date: -1 });
            return res.status(200).json({ message: "Event Stories fetched successfully", data: eventStoriesList });
        } catch (error) {

            return res.status(500).json({ message: "Server Error", error: error.message });
        }
    }
}
module.exports = {
    createEventsStories,
    getEventStories
};
