const uploadtoS3 = require("../config/s3Uploader");
const BlogModel = require("../Model/BlogModel");
const createBlog = async (req, res) => {

    console.log("destructuring the req.body to verify we have everythign for the blog creation");
    const { title, date, link, meta, excerpt, paragraph, faqs } = req.body;

    if (!title || !date || !link || !excerpt || !paragraph.length) {
        return res.status(400).json({
            message: "Please provide the title , date , link , excerpt , or paragraph content"
        });
    }

    const img = await uploadtoS3(req.file, "Blogs");
    // S3 upload error
    if (!img) {
        return res.status(500).json({
            message: "Something went wrong while uploading the image. Please try again."
        });
    }

    // JSON parse
    let parsedMeta, parsedParagraph, parsedFaqs;
    try {
        if (typeof meta === "string") parsedMeta = JSON.parse(meta);
        if (typeof paragraph === "string") parsedParagraph = JSON.parse(paragraph);
        if (faqs && typeof faqs === "string") parsedFaqs = JSON.parse(faqs);
    } catch (err) {
        console.error("Error parsing JSON:", err);
        return res.status(400).json({ message: "Invalid JSON in meta, paragraph, or faqs" });
    }

    try {
        const newBlog = await BlogModel.create({
            img,
            title,
            date,
            link,
            meta: parsedMeta,
            excerpt,
            paragraph: parsedParagraph,
            faqs: parsedFaqs
        });
        if (newBlog) {
            return res.status(201).json({
                message: "Blog created successfully"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }

}
const getBlog = async (req, res) => {
    try {
        console.log("Fetching all blogs...");

        // Fetch all blogs, sorted by latest first
        const blogs = await BlogModel.find().sort({ date: -1 });

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found"
            });
        }

        return res.status(200).json({
            message: "Blogs fetched successfully",
            blogs
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const deleteById = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id is required" });
    try {
        const deleted = await BlogModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, date, link, meta, excerpt, paragraph, faqs } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Blog id is required"
        });
    }

    try {
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Upload new image if provided
        if (req.file) {
            const img = await uploadtoS3(req.file, "Blogs");
            if (!img) {
                return res.status(500).json({
                    message: "Error uploading image"
                });
            }
            blog.img = img;
        }

        // Parse JSON fields safely
        try {
            if (meta) blog.meta = typeof meta === "string" ? JSON.parse(meta) : meta;
            if (paragraph) blog.paragraph = typeof paragraph === "string" ? JSON.parse(paragraph) : paragraph;
            if (faqs) blog.faqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
        } catch (err) {
            return res.status(400).json({
                message: "Invalid JSON in meta, paragraph, or faqs"
            });
        }

        // Update simple fields
        if (title) blog.title = title;
        if (date) blog.date = date;
        if (link) blog.link = link;
        if (excerpt) blog.excerpt = excerpt;

        const updatedBlog = await blog.save();

        return res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {
        console.error("Update blog error:", error && error.message);
        return res.status(500).json({
            message: "Something went wrong",
            error: error && error.message
        });
    }
};


module.exports = {
    createBlog,
    getBlog,
    deleteById,
    updateBlog
};