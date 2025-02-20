const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true }, // Unique Course ID
    name: { type: String }, // Course Name
    duration: { type: String  }, // Duration (e.g., "3 Months")
    price: { type: Number }, // Price (Number format)
    description: { type: String } // Course Description
}, { timestamps: true }); // Adds createdAt & updatedAt timestamps

module.exports = mongoose.model("Course", CourseSchema);
