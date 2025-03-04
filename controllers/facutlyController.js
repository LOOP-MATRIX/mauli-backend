// controllers/facultyController.js
const Faculty = require("../models/faculty");

// Create a new faculty member
exports.createFaculty = async (req, res) => {
    try {
        const { name, description, qualification, category } = req.body;
        const image = req.file ? '/images/' + req.file.filename : "";
        
        const faculty = new Faculty({ name, description, qualification, category, image });
        await faculty.save();
        res.status(201).json({ message: "Faculty added successfully", faculty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all faculty members
exports.getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single faculty member by ID
exports.getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update faculty details
exports.updateFaculty = async (req, res) => {
    try {
        const { name, description, qualification, category } = req.body;
        let updatedData = { name, description, qualification, category };
        if (req.file) {
            updatedData.image = '/images/' + req.file.filename;
        }
        
        const faculty = await Faculty.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json({ message: "Faculty updated successfully", faculty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a faculty member
exports.deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndDelete(req.params.id);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json({ message: "Faculty deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Create a new faculty member
exports.createFaculty = async (req, res) => {
    try {
        const { name, description, qualification, category } = req.body;
        const image = req.file ? req.file.filename : "";
        
        const faculty = new Faculty({ name, description, qualification, category, image });
        await faculty.save();
        res.status(201).json({ message: "Faculty added successfully", faculty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all faculty members
exports.getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single faculty member by ID
exports.getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update faculty details
exports.updateFaculty = async (req, res) => {
    try {
        const { name, description, qualification, category } = req.body;
        let updatedData = { name, description, qualification, category };
        if (req.file) {
            updatedData.image =req.file.filename;
        }
        
        const faculty = await Faculty.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json({ message: "Faculty updated successfully", faculty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a faculty member
exports.deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndDelete(req.params.id);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json({ message: "Faculty deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


