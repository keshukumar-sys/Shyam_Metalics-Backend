const mongoose = require('mongoose');
const AwardStoriesSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
    },
    slug:{
        type:String,
        required:true,
    },
    short_description:{  

        required:true,
        type:String,
    },
    event_start_date:{
        required:true,
        type:Date,  
    },
    event_end_date:{
        required:true,
        type:Date,
    },
    event_location:{
       name:{
        type:String,
        required:true,
       },
       country:{
        type:String,
        required:true,
       }
    },
    event_type:{
        name:{
            type:String,
        }
    },
    front_image:{
        url:{
            type:String,
            required:true,
        }
    },
    content:[
        {
            type:{
                type:String,
                default:"paragraph"
            },
            text:{
                type:String
            }
        }
    ]

});
module.exports = mongoose.model('AwardStories', AwardStoriesSchema);
