
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    image: String,
    name: { type: String, required: true },
    duration: String,
    fees: String,
    keyPoints: String,
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);

