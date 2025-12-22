const mongoose = require("mongoose");
const AwardSchema = new mongoose.Schema({
    image:{
        type:String,
        required:[true, "image for the award is required"]
    },
    title:{
        type:String ,
        required:[true,"Title for the award is required"]
    },
    category:{
        type:String,
        required:[true , "Category should be required"]
    },
    description:{
        type:String , 
        required:[true , "Desrciption is required for the award"]
    }
});

const AwardModel = mongoose.model("Award" , AwardSchema);
module.exports = AwardModel;