const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Fixed ID for sequence tracking
  seq: { type: Number, default: 0}, // Ensures uniqueness
});

module.exports = mongoose.model("Counter", counterSchema);
