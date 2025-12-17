const mongoose = require("mongoose");
const AwardEventsSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String,
    },
    description:{
        required:true,
        type:String,
    },
    icon:{
        required:true,
        type:String,
    }
});

module.exports = mongoose.model("AwardEvents", AwardEventsSchema);