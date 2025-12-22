const uploadtoS3 = require("../config/s3Uploader");
const EventStories = require("../Model/AwardStories");
const createEventsStories = async (req, res) => {
    try {
        console.log("hello welcome to crete the stories");
        console.log("HEADERS:", req.headers["content-type"]);
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { name, slug, short_description, event_start_date, event_end_date, event_location, event_type , content} = req.body;
        if (!name || !slug || !short_description || !event_start_date || !event_end_date || !event_location || !event_type) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log("After the validation");
        let parsedEventLocation;
        let parsedEventType;
        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
        } catch {
            return res.status(400).json({ message: "Invalid content JSON" });
        }
        try {
            parsedEventLocation = typeof event_location === "string"
                ? JSON.parse(event_location)
                : event_location;

            parsedEventType = typeof event_type === "string"
                ? JSON.parse(event_type)
                : event_type;

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: "Invalid JSON format for event_location or event_type",
                error: error.message
            });
        }

        console.log("after the parsing")
        const imageUrl = await uploadtoS3(req.file, "event-news");
        const newEventStories = new EventStories({
            name,
            slug,
            short_description,
            event_start_date,
            event_end_date,
            event_location: parsedEventLocation,
            event_type: parsedEventType,
            front_image: { url: imageUrl },
            content: parsedContent
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

const deleteById = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id is required" });
    try {
        const deleted = await EventStories.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports.deleteById = deleteById;
