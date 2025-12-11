const mongoose = require("mongoose");
const TdsSchema = new mongoose.Schema({
    tds_details:[
        {
            tds_name:{
                type:String ,
                required:[true , "Please enter the tds name"]
            },
            tds_date:{
                type:String ,
                required:[true , "Please Enter the tds date"]
            },
            tds_file:{
                type:String,
                required:[true , "Please enter the tds file data"]
            }
        }
    ]
},{
    timestamps:true
});


const TdsModel = mongoose.model("TDS" , TdsSchema);
module.exports = TdsModel;

