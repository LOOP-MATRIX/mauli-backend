// routes/facultyRoutes.js
const express = require("express");
const uploadimg = require("../config/multer");
const facultyController = require("../controllers/facutlyController");

const router = express.Router();

router.post("/create", uploadimg.single("image"), facultyController.createFaculty);
router.get("/all", facultyController.getAllFaculties);
router.get("/:id", facultyController.getFacultyById);
router.put("/:id", uploadimg.single("image"), facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;