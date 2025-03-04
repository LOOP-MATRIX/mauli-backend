const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
  checkAdmin,
  getAllUsers,
  deleteUser
} = require("../controllers/registerController");
const { updatePaymentStatus ,updateDueDateStatus} = require("../controllers/paymentController");

const router = express.Router();

// Route to register a new user (Default: "user", but can set "admin" manually)
router.post("/register",  registerUser);

// Route to get all users
router.get("/getAll", getAllUsers);
// Route to login a user
router.post("/login", loginUser);

// Route to get user info (by ID)
router.get("/user/:id", getUserInfo);
router.delete("/:id", deleteUser);

// Protected Admin Route (Only accessible to Admins)
router.get("/admin-dashboard", checkAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! You have access to this dashboard." });
});

// Route to update payment status of a user
router.put("/:id/payment-status", updatePaymentStatus);
router.put("/duedate/:userId/:duedateId",updateDueDateStatus)


module.exports = router;
