const Course = require("../models/course");

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { courseId, name, duration, price, description } = req.body;

        // Check if course already exists
        const existingCourse = await Course.findOne({ courseId });
        if (existingCourse) {
            return res.status(400).json({ message: "Course ID already exists" });
        }

        // Create new course
        const newCourse = new Course({ courseId, name, duration, price, description });
        await newCourse.save();

        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
        console.log(error);
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update a course
const updateCourse = async (req, res) => {
    try {
        const { name, duration, price, description } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { name, duration, price, description },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };
