const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOADS_DIR || "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Filter video files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["video/mp4",
        "video/mkv",
        "video/webm",
        "video/avi",
        "video/mov",];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 * 1024 }, // 3GB limit
    fileFilter,
});

module.exports = upload;
