const express = require("express");
const {
    createAdmission,
    getAllAdmissions,
    getAdmissionById,
    updateAdmission,
    deleteAdmission
} = require("../controllers/courseAdmissionController");

const router = express.Router();

// Route to create an admission entry
router.post("/admissions", createAdmission);

// Route to get all admissions
router.get("/admissions", getAllAdmissions);

// Route to get a single admission by ID
router.get("/admissions/:id", getAdmissionById);

// Route to update an admission
router.put("/admissions/:id", updateAdmission);

// Route to delete an admission
router.delete("/admissions/:id", deleteAdmission);

module.exports = router;
