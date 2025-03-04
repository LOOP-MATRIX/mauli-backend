const CourseAdmission = require("../models/courseAdmission");

// Create a new course admission entry
// const createAdmission = async (req, res) => {
//     try {
//         const { name, Qualification, YoP, course, address, phone, email } = req.body;

//         // Check if email already exists
//         const existingUser = await CourseAdmission.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         // Create a new admission entry
//         const newAdmission = new CourseAdmission({
//             name,
//             Qualification,
//             YoP,
//             course,
//             address,
//             phone,
//             email
//         });

//         await newAdmission.save();
//         res.status(201).json({ message: "Admission Successful", admission: newAdmission });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const createAdmission = async (req, res) => {
    try {
        const { name,subject,message, email } = req.body;

        // Check if email already exists
        const existingUser = await CourseAdmission.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create a new admission entry
        const newAdmission = new CourseAdmission({
            name,
            subject,
            message,
            email
        });

        await newAdmission.save();
        res.status(201).json({ message: "Admission Successful", admission: newAdmission });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all admissions
const getAllAdmissions = async (req, res) => {
    try {
        const admissions = await CourseAdmission.find();
        res.status(200).json(admissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single admission by ID
const getAdmissionById = async (req, res) => {
    try {
        const admission = await CourseAdmission.findById(req.params.id);
        if (!admission) {
            return res.status(404).json({ message: "Admission not found" });
        }
        res.status(200).json(admission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an admission entry
const updateAdmission = async (req, res) => {
    try {
        const updatedAdmission = await CourseAdmission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedAdmission) {
            return res.status(404).json({ message: "Admission not found" });
        }

        res.status(200).json({ message: "Admission Updated Successfully", admission: updatedAdmission });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an admission entry
const deleteAdmission = async (req, res) => {
    try {
        const deletedAdmission = await CourseAdmission.findByIdAndDelete(req.params.id);
        if (!deletedAdmission) {
            return res.status(404).json({ message: "Admission not found" });
        }
        res.status(200).json({ message: "Admission Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createAdmission,
    getAllAdmissions,
    getAdmissionById,
    updateAdmission,
    deleteAdmission
};
