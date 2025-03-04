const mongoose = require('mongoose');
const faculty = require('./faculty');

const batchSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseName:{
        type: String,
        required: true
    },
    currentVideoAccess:{
        type:Number,
        default:0
    },
    batchStatus:{
        type: String,
        enum: ['ongoing','completed'],
        default: 'ongoing'
    },
    courseName:{
        type: String,
        required: true
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    }]
})


module.exports = mongoose.model('Batch', batchSchema);