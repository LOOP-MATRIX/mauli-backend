const batchSchema = require("../models/batch");
const courseSchema = require("../models/course");
// const facultySchema = require("../models/faculty");
const videoSchema = require("../models/video");
const registerSchema = require("../models/register");

// Create a new batch
// exports.createBatch = async (req, res) => {
//   try {
//     const { name, courseID, facultyID, courseName, facultyName, students } =
//       req.body;

//     if (
//       !name ||
//       !courseID ||
//       !facultyID ||
//       !courseName ||
//       !facultyName ||
//       !students
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Verify payment status
//     const unpaidStudents = await registerSchema.find({
//       _id: { $in: students },
//       paymentStatus: { $ne: "paid" },
//     });
//     if (unpaidStudents.length > 0) {
//       return res
//         .status(400)
//         .json({ message: "All students must have paid their fees" });
//     }

//     // Create batch
//     const batch = new batchSchema({
//       name,
//       courseID,
//       facultyID,
//       courseName,
//       facultyName,
//       students,
//     });
//     await batch.save();

//     // Update students' status to "inactive"
//     await registerSchema.updateMany(
//       { _id: { $in: students } },
//       { $set: { status: "inactive" } }
//     );

//     res.status(201).json({ message: "Batch created successfully", batch });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.createBatch = async (req, res) => {
  try {
    const { name, courseID, courseName, students } =
      req.body;

    if (
      !name ||
      !courseID ||
      !courseName ||
      students.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBatch = await batchSchema.findOne({ name });
    if (existingBatch) {
      return res.status(400).json({ message: "Batch name already in use" });
    }

    // Verify payment status
    const unpaidStudents = await registerSchema.find({
      _id: { $in: students },
      paymentStatus: { $ne: "paid" },
    });

    console.log("Unpaid Students:", unpaidStudents); // Debugging Log

    if (unpaidStudents.length > 0) {
      return res.status(400).json({
        message: "All students must have paid their fees",
        unpaidStudents: unpaidStudents.map((s) => s._id), // Return unpaid student IDs
      });
    }

    // Create batch
    const batch = new batchSchema({
      name,
      courseID,
      courseName,
      students,
    });
    await batch.save();

    // Update students' status to "inactive"
    await registerSchema.updateMany(
      { _id: { $in: students } },
      { $set: { status: "inactive" } }
    );

    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (err) {
    console.error("Error creating batch:", err); // Log error for debugging
    res.status(500).json({ message: err.message });
  }
};
// Check if batch name already exists

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await batchSchema.find();
    if (!batches) {
      return res.status(404).json({ message: "No batches created yet" });
    }
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await batchSchema.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { name, courseID,  courseName,  students } =
      req.body;
    let updatedData = {
      name,
      courseID,
      courseName,
      students,
    };

    const batch = await batchSchema.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json({ message: "Batch updated successfully", batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const batch = await batchSchema.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBatchesByCourseId = async (req, res) => {
  try {
    const batches = await batchSchema.find({ courseID: req.params.courseId });
    if (!batches) {
      return res
        .status(404)
        .json({ message: "No batches found for this course" });
    }
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBatchesByFacultyId = async (req, res) => {
  try {
    const batches = await batchSchema.find({ facultyID: req.params.facultyId });
    if (!batches) {
      return res
        .status(404)
        .json({ message: "No batches found for this faculty" });
    }
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentsByBatchId = async (req, res) => {
  try {
    const batch = await batchSchema.findById(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    const students = await registerSchema.find({ _id: batch.students });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeStudentFromBatch = async (req, res) => {
  try {
    const { batchId, studentId } = req.body;

    if (!batchId || !studentId) {
      return res
        .status(400)
        .json({ message: "Batch ID and Student ID are required" });
    }

    // Find the batch
    const batch = await batchSchema.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Check if the student is in the batch
    if (!batch.students.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Student not found in this batch" });
    }

    // Remove student from batch
    batch.students = batch.students.filter((id) => id.toString() !== studentId);
    await batch.save();

    // Update student's status to "active"
    await registerSchema.findByIdAndUpdate(studentId, { status: "active" });

    res.status(200).json({
      message: "Student removed from batch and status updated to active",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addStudentToBatch = async (req, res) => {
  try {
    const { batchId, studentId } = req.body;

    if (!batchId || !studentId) {
      return res
        .status(400)
        .json({ message: "Batch ID and Student ID are required" });
    }

    // Find the batch
    const batch = await batchSchema.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Check if the student is already in the batch
    if (batch.students.includes(studentId)) {
      return res.status(400).json({ message: "Student already in this batch" });
    }

    // Add student to batch
    batch.students.push(studentId);
    await batch.save();

    // Update student's status to "inactive"
    await registerSchema.findByIdAndUpdate(studentId, { status: "inactive" });

    res.status(200).json({
      message: "Student added to batch and status updated to inactive",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBatchDetailsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Validate studentId format (assuming it's a MongoDB ObjectId)
        // if (!mongoose.Types.ObjectId.isValid(studentId)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid student ID format'
        //     });
        // }

        // Find batch where the student is enrolled
        const batch = await batchSchema.findOne({ students: studentId })
            .populate('courseID', 'name duration') // Populating course details (adjust fields as needed)
            .populate('students', 'name email') // Populating student details (adjust fields as needed)
            .select('-__v'); // Excluding version key

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'U have not added in any group yet'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Batch details retrieved successfully',
            data: batch
        });

    } catch (error) {
        console.error('Error fetching batch details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};