const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId:{type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,},
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", VideoSchema);
