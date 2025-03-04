const express = require('express');
const router = express.Router();
const { createQRCode, getAllQRCodes } = require('../controllers/qrController');
const upload = require('../config/multer'); // Your multer setup

// Route to create QR code with image upload
router.post('/create', upload.single('image'), createQRCode);

// Route to get all QR codes
router.get('/', getAllQRCodes);

module.exports = router;