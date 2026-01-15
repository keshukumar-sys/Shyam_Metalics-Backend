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

const deleteById = async (req, res) => {
    const id = req.body.id || req.params.id;
    if (!id) return res.status(400).json({ message: "id is required" });
    try {
        const deleted = await EventNews.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateEventNews = async (req, res) => {
    const { id } = req.params;
    const { slug, category, date, title, description, content } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Event News id is required" });
    }

    try {
        const eventNews = await EventNews.findById(id);
        if (!eventNews) {
            return res.status(404).json({ message: "Event News not found" });
        }

        // Parse content JSON safely
        if (content) {
            try {
                eventNews.content = typeof content === "string" ? JSON.parse(content) : content;
            } catch {
                return res.status(400).json({ message: "Invalid content JSON" });
            }
        }

        // Upload new image if provided
        if (req.file) {
            const imageUrl = await uploadtoS3(req.file, "event-news");
            if (!imageUrl) {
                return res.status(500).json({ message: "Image upload failed" });
            }
            eventNews.image = imageUrl;
        }

        // Update basic fields
        if (slug) eventNews.slug = slug;
        if (category) eventNews.category = category;
        if (date) eventNews.date = date;
        if (title) eventNews.title = title;
        if (description) eventNews.description = description;

        const updatedEventNews = await eventNews.save();

        return res.status(200).json({
            message: "Event News updated successfully",
            data: updatedEventNews
        });

    } catch (error) {
        console.error("Update Event News error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
module.exports.updateEventNews = updateEventNews;
module.exports.deleteById = deleteById;