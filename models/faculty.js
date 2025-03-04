const mongoose = require('mongoose')

const facultySchema = new mongoose.Schema(
    {
        image:String,
        name:String,
        description:String,
        qualification:String,
        category:{
            type:String,
            default:'Endocrinology'
        }
    }
)

module.exports = mongoose.model('Faculty',facultySchema)