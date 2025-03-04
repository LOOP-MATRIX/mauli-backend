const Register = require("../models/register");

// Get all users with payment status
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Register.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await Register.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  if (!["paid", "unpaid", "pending"].includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  try {
    // Find the user
    const user = await Register.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update payment status
    user.paymentStatus = paymentStatus;

    // If payment is set to "paid", update ONLY the first due date
    if (paymentStatus === "paid" && user.dueDates?.length > 0) {
      user.dueDates[0].status = "paid"; // ✅ Update only the first due date
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDueDateStatus = async (req, res) => {
  try {
    const { userId, duedateId } = req.params; // Get user ID and due date ID from request params

    // Find the user by ID
    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has due dates
    if (!user.dueDates || user.dueDates.length === 0) {
      return res.status(404).json({ message: "No due dates found for this user" });
    }

    // Find the specific due date inside the array
    const dueDateEntry = user.dueDates.id(duedateId);
    if (!dueDateEntry) {
      return res.status(404).json({ message: "Due date entry not found" });
    }

    // Update the status to "paid"
    dueDateEntry.status = "paid";

    if(user.paymentStatus==="unpaid"){
      user.paymentStatus="paid"
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Due date updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await Register.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
