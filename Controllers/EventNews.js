const EventNews = require("../Model/AwardNewsModel");
const uploadtoS3 = require("../config/s3Uploader");
const createEventNews = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const { slug, category, date, title, description, content } = req.body;

        if (!slug || !category || !date || !title || !description || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
        } catch {
            return res.status(400).json({ message: "Invalid content JSON" });
        }

        const imageUrl = await uploadtoS3(req.file, "event-news");

        const newEventNews = new EventNews({
            slug,
            category,
            date,
            title,
            description,
            image: imageUrl,
            content: parsedContent
        });

        await newEventNews.save();

        return res.status(201).json({
            message: "Event News created successfully",
            data: newEventNews
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};



const getAllEventNews = async (req, res) => {
    {
        try {
            const eventNewsList = await EventNews.find().sort({ date: -1 });
            return res.status(200).json({ message: "Event News fetched successfully", data: eventNewsList });
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error: error.message });

        }
    }
}

module.exports = {
    createEventNews,
    getAllEventNews
}