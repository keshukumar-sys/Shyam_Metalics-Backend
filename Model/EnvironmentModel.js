const mongoose = require("mongoose");
const EnvironmentSchema = new mongoose.Schema({
    environment_detail:[
        {
            detail_name:{
                type:String,
                required:[true , "Environment details is required"]
            },

            detail_date:{
                type:Date,
                required:[true, "Kindly enter date"]
            },
            detail_file:{
                type:String,
                required:[true , "Please upload the file"]
            }
        }
    ]
} ,{
    timestamps:true
});


const EnvironmentModel = mongoose.model("Environment" , EnvironmentSchema);

module.exports = EnvironmentModel;