const Video = require("../models/video");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobeInstaller = require("@ffprobe-installer/ffprobe");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
const mongoose = require("mongoose");

// Function to get the codec of the uploaded video
const getVideoCodec = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(stream => stream.codec_type === "video");
        resolve(videoStream ? videoStream.codec_name : null);
      }
    });
  });
};

// Function to convert H.265 to H.264
const convertToH264 = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(path.dirname(inputPath), `converted-${path.basename(inputPath)}`);

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec("libx264") // Convert to H.264
      .audioCodec("aac")      // Convert audio for compatibility
      .on("end", () => {
        fs.unlinkSync(inputPath); // Delete original H.265 file
        resolve(outputPath);
      })
      .on("error", (err) => reject(err))
      .run();
  });
};

// Upload Video with Format Check & Conversion
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { courseId } = req.params;
    const { title } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId format" });
    }

    const inputPath = req.file.path;
    const codec = await getVideoCodec(inputPath);

    let finalPath = inputPath; // Default to original file
    if (codec === "hevc") { // If HEVC (H.265), convert
      console.log("Converting HEVC to H.264...");
      finalPath = await convertToH264(inputPath);
    }

    const newVideo = new Video({
      title,
      courseId: new mongoose.Types.ObjectId(courseId),
      filename: path.basename(finalPath), // Save converted filename
      size: fs.statSync(finalPath).size, // Get new file size
    });

    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error: error.message });
  }
};



// Fetch all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};

// Fetch a single video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error: error.message });
  }
};

// Get videos by courseId
exports.getVideosByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId format" });
    }

    // Find videos associated with the given courseId
    const videos = await Video.find({ courseId });

    if (!videos.length) {
      return res.status(404).json({ message: "No videos found for this course" });
    }

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};




// Stream video in chunks
exports.streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const videoPath = path.join(__dirname, "../uploads", video.filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      return res.status(400).send("Requires Range header");
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const fileStream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error streaming video", error: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { videoId, courseId } = req.params;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid videoId or courseId format" });
    }

    // Find the video
    const video = await Video.findOne({ _id: videoId, courseId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete the video file from the filesystem
    const videoPath = path.join(__dirname, "../uploads", video.filename);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Remove video from the database
    await Video.findByIdAndDelete(videoId);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};

