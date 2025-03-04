const QRCode = require('../models/qr');
const path = require('path');

// Create QR Code entry with image and title
exports.createQRCode = async (req, res) => {
  try {
    // Check if file is uploaded via multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const { title } = req.body;
    
    // Get the image path from multer
    const imagePath = `${req.file.filename}`;

    // Create new QR code entry
    const qrCode = await QRCode.create({
      title,
      image: imagePath
    });

    res.status(201).json({
      success: true,
      data: qrCode,
      message: 'QR Code entry created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating QR Code entry',
      error: error.message
    });
  }
};

// Get all QR Codes
exports.getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find();
    
    res.status(200).json({
      success: true,
      count: qrCodes.length,
      data: qrCodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching QR Codes',
      error: error.message
    });
  }
};