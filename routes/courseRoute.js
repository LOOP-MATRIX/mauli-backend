    const express = require("express");
    const upload = require("../config/multer");
    const courseController = require("../controllers/courseController");

    const router = express.Router();

    router.post("/create", upload.single("image"), courseController.createCourse);
    router.get("/all", courseController.getAllCourses);
    router.get("/:id", courseController.getCourseById);
    router.put("/:id", upload.single("image"), courseController.updateCourse);
    router.delete("/:id", courseController.deleteCourse);

    module.exports = router;
