const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema({
    img:{
        type:String,
        required:[true , "Please ensure to upload the image"]
    },
    title:{
        type:String,
        required:[true , "Please ensure to provide the title of the blogs"]
    },
    date:{
        type:Date,
        required:[true , "Please ensure to provide the date in the correct format like YYYY-MM-DD"]
    },
    link:{
        type:String,
        required:[true , "Please ensure to provide the url you want for the blog like the dummy example /blogs/{Your provided url} "]
    },
    meta:{
        title:String,
        description:String,
        canonical:String,
        ogTitle:String,
        ogDescription:String,
        ogUrl:String
    },
    excerpt:{
        type:String,
        required:[true , "Please provide the breif description or the tag line you wanna give to your blog"]
    },
    paragraph:[
        {
            description:[{
                desc:String
            }]
        }
    ],
    faqs:{
        desc:String,
        list:[{
            listTitle:String,
            listdesc:String
        }]
    }
});

const BlogModel = mongoose.model("blogs" , BlogSchema);


module.exports= BlogModel;