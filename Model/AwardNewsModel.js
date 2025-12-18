const { text } = require('express');
const mongoose = require('mongoose');
const AwardNewsSchema = new mongoose.Schema({
    slug: {
        required: true,
        type: String,
    },
    category: {
        required: true,
        enum: ['Leadership Recognition',  'Community Service', 'Corporate Excellence', 'Employee Achievement', "CSR Initiative", "Corporate Event", "Industry Leadership", "Wellness Event", "Safety Initiative", "CSR Initiative", "Training Program", "Manufacturing"],
        type: String,
    },
    
    date: {
        required: true,
        type: Date,
    },
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    image: {
        required: true,
        type: String,
    },
    content: [
        {
            type: { type: String, enum: ['paragraph', 'heading'], required: true },
            text: {
                type: String,
                required: true,
            }
        }
    ]
});
module.exports = mongoose.model('AwardNews', AwardNewsSchema);
