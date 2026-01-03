const mongoose = require("mongoose")
const uploadSchema = new mongoose.Schema({
    name:String,
    file:String
});
const Upload = mongoose.model("uplaoad" ,uploadSchema);
module.exports=Upload;