const express = require("express");
const { registerUser, loginUser, getUserInfo, checkAdmin } = require("../controllers/registerController");

const router = express.Router();

// Route to register a new user (Default: "user", but can set "admin" manually)
router.post("/register", registerUser);

// Route to login a user
router.post("/login", loginUser);

// Route to get user info (by ID)
router.get("/user/:id", getUserInfo);

// Protected Admin Route (Only accessible to Admins)
router.get("/admin-dashboard", checkAdmin, (req, res) => {
    res.json({ message: "Welcome Admin! You have access to this dashboard." });
});

module.exports = router;
