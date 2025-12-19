const mongoose = require("mongoose");
const DisclosuresSchema = new mongoose.Schema({
    detail:[
        {
            name:{
                type:String ,
                required:[true , "Please enter the disclosures name"]
            },
            date:{
                type:String ,
                required:[true , "Please Enter the disclosures date"]
            },
            file:{
                type:String,
                required:[true , "Please enter the disclosures file data"]
            }
        }
    ]
},{
    timestamps:true
});


const DisclosuresModel = mongoose.model("Disclosures" , DisclosuresSchema);
module.exports = DisclosuresModel;
