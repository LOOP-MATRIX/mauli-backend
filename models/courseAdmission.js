    const mongoose = require("mongoose")

    const courseSchema = new mongoose.Schema({
        name:{
            type:String,
        },
        Qualification:{
            type:String
        },
        YoP:{
            type:String
        },
        course:{
            type:String
        },
        address:{
            type:String
        },
        phone:{
            type:Number
        },
        email:{
            type:String,
            unique:true
        }
    })

    module.exports = mongoose.model("courseAdmission", courseSchema)