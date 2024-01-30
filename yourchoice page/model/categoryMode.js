//const { ObjectId } = require('mongodb')
const mongoose = require('mongoose');

const categSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true,
    },
    is_listed: {
        type: Boolean,  // Fix the typo here
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const category = mongoose.model('category', categSchema);

module.exports = category;