const express = require("express");
const batchController = require("../controllers/batchController");

const router = express.Router()

router.post('/create',batchController.createBatch)
router.get('/all',batchController.getAllBatches)
router.get('/:id',batchController.getBatchById)
router.put('/:id',batchController.updateBatch)
router.delete('/:id',batchController.deleteBatch)
router.get('/courseId/:courseId',batchController.getBatchesByCourseId)
router.get('/facultyId/:facultyId',batchController.getBatchesByFacultyId)
router.get('/studentId/:batchId',batchController.getStudentsByBatchId)
router.put('/removeStudent',batchController.removeStudentFromBatch)
router.get('/getBatchByStudentId/:studentId',batchController.getBatchDetailsByStudent)


module.exports = router;