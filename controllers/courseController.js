const Course = require("../models/course");
const Register = require("../models/register");
const batchSchema = require("../models/batch");
// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, duration, fees, keyPoints } = req.body;
    const image = req.file ? req.file.filename : "";

    const course = new Course({
      name,
      duration,
      fees,
      keyPoints,
      image,
    });
    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const {
      name,
      duration,
      fees,
      // discount,
      // installments,
      // recordingsAvailability,
      // language,
      // classModule,
      // platform,
      // studyMaterial,
      // certificate,
      // discussionPlatform,
      keyPoints,
    } = req.body;
    let updatedData = {
      name,
      duration,
      fees,
      // discount,
      // installments,
      // recordingsAvailability,
      // language,
      // classModule,
      // platform,
      // studyMaterial,
      // certificate,
      // discussionPlatform,
      keyPoints,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course
// exports.deleteCourse = async (req, res) => {
//     try {
//         const course = await Course.findByIdAndDelete(req.params.id);
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         res.status(200).json({ message: "Course deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Set all users with this course_id to "inactive"
    await Register.updateMany(
      { course_id: req.params.id },
      { $set: { status: "inactive" } }
    );

    res.status(200).json({
      message: "Course deleted successfully, and students set to inactive",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
