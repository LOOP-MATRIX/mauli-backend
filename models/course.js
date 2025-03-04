// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//     image: String,
//     name: { type: String, required: true },
//     duration: String,
//     fees: String,
//     discount: String,
//     installments: String,
//     recordingsAvailability: String,
//     language: String,
//     classModule: String,
//     platform: String,
//     studyMaterial: String,
//     certificate: String,
//     discussionPlatform: String,
//     keyPoints: String,
// }, { timestamps: true });

// module.exports = mongoose.model("Course", courseSchema);

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    image: String,
    name: { type: String, required: true },
    duration: String,
    fees: String,
    // discount: String,
    // installments: String,
    // recordingsAvailability: String,
    // language: String,
    // classModule: String,
    // platform: String,
    // studyMaterial: String,
    // certificate: String,
    // discussionPlatform: String,
    keyPoints: String,
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);

