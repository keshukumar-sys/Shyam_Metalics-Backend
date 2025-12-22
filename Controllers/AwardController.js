const Award = require("../Model/AwardMode.js");
const uploadtoS3 = require("../config/s3Uploader.js");
const createAwards = async (req, res) => {

    console.log("in the create awards section");
    const { category , title, description } = req.body;
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
        console.log(error);
        return res.status(500).json({
            message: "somethign went wrong",
            error: error
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
        console.log(error);
        return res.status(500).json({
            message: "somethign went wrong",
            error: error
        })
    }
}

module.exports ={
    createAwards,
    getAwards
}