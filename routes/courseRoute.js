const express = require("express");
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const router = express.Router();

// Create a new course
router.post("/create", createCourse);

// Get all courses
router.get("/", getAllCourses);

// Get a single course by ID
router.get("/:id", getCourseById);

// Update a course by ID
router.put("/:id", updateCourse);

// Delete a course by ID
router.delete("/:id", deleteCourse);

module.exports = router;
