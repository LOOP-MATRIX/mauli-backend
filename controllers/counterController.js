const Counter = require("../models/counter");

// Function to generate a unique registration number
const generateRegistrationNumber = async () => {
  try {
    console.log("🔄 Fetching counter from DB...");

    // Fetch and increment the sequence number
    const counter = await Counter.findByIdAndUpdate(
      { _id: "counter" },  // Unique ID for tracking sequence
      { $inc: { seq: 1 } }, // Increment counter by 1
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!counter) {
      throw new Error("Counter document not found or couldn't be updated.");
    }

    console.log("✅ Counter fetched successfully:", counter);

    // Generate registration number
    const registrationNumber = `DSEIMS/KOP/D-${counter.seq.toString().padStart(3, "0")}`;

    console.log("🎉 Generated Registration Number:", registrationNumber);
    return registrationNumber;
  } catch (error) {
    console.error("🚨 Error in generateRegistrationNumber():", error);
    throw error;
  }
};

// API to get the next registration number
const getRegistrationNumber = async (req, res) => {
  try {
    console.log("📩 Incoming request for registration number...");

    const registrationNumber = await generateRegistrationNumber();

    res.status(200).json({ success: true, registrationNumber });
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getRegistrationNumber };
