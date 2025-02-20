const express = require("express");
const upload = require("../config/multer");
const videoController = require("../controllers/videoController");

const router = express.Router();

router.post("/upload/:courseId", upload.single("video"), videoController.uploadVideo);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);
router.get("/stream/:id",videoController.streamVideo)
router.delete("/:videoId/:courseId", videoController.deleteVideo);


module.exports = router;
