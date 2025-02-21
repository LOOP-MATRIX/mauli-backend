const express = require("express");
const {authRole} = require("../middleware/auth")
const uploadimg = require('../config/imageMulter')
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const router = express.Router();

// Create a new course
router.post("/create",authRole,uploadimg.single("image"), createCourse);

// Get all courses
router.get("/", getAllCourses);

// Get a single course by ID
router.get("/:id", getCourseById);

// Update a course by ID
router.put("/:id",authRole,uploadimg.single("image"), updateCourse);

// Delete a course by ID
router.delete("/:id",authRole, deleteCourse);

module.exports = router;
