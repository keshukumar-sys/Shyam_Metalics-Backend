const Award = require("../Model/AwardMode.js");
const uploadtoS3 = require("../config/s3Uploader.js");
const createAwards = async (req, res) => {

    console.log("in the create awards section");
    const { category, title, description } = req.body;
    if (!category || !title || !description) {
        return res.status(400).json({
            message: "All 4 entries are required.."
        });
    }
    let image;

    try {
        image = await uploadtoS3(req.file, "awards");
        if (!image) {
            res.status(400).json({
                message: "something went wrong please try again"
            });

        }

        const award = await Award.create({
            image, title, description, category
        });
        if (!award) {
            return res.status(400).json({
                message: "Unable to create the award  right now please try again later.."
            })
        }

        return res.status(201).json({
            message: "Awards created successfully..",
            item: award
        });

    } catch (error) {
        console.error('Create award error:', error && error.message);
        return res.status(500).json({
            message: "somethign went wrong",
            error: error && error.message
        })
    }
}


const getAwards = async (req, res) => {
    try {
        const awards = await Award.find();
        if (!awards) {
            return res.status(500).json({
                message: "something went wrong please try again later",
            });
        }
        return res.status(200).json({
            message: "Awards fetched successfully",
            award: awards
        });
    } catch (error) {
        console.error('Get awards error:', error && error.message);
        return res.status(500).json({
            message: "somethign went wrong",
            error: error && error.message
        })
    }
}

const deleteById = async (req, res) => {
    const { id } = req.body;

    try {
        const deletedItem = await Award.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        return res.status(200).json({
            message: "Item deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({
            message: "Server error while deleting item",
        });
    }
};
const updateAward = async (req, res) => {
    const { id } = req.params;
    const { category, title, description } = req.body;

    try {
        const award = await Award.findById(id);
        if (!award) {
            return res.status(404).json({
                message: "Award not found",
            });
        }

        // If new image is uploaded, update it
        if (req.file) {
            const image = await uploadtoS3(req.file, "awards");
            if (!image) {
                return res.status(400).json({
                    message: "Image upload failed, please try again",
                });
            }
            award.image = image;
        }

        // Update fields if provided
        if (category) award.category = category;
        if (title) award.title = title;
        if (description) award.description = description;

        const updatedAward = await award.save();

        return res.status(200).json({
            message: "Award updated successfully",
            item: updatedAward,
        });

    } catch (error) {
        console.error("Update award error:", error && error.message);
        return res.status(500).json({
            message: "Something went wrong",
            error: error && error.message,
        });
    }
};


module.exports = {
    createAwards,
    getAwards, deleteById , updateAward
}