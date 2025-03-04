const Register = require("../models/register");
const Course = require("../models/course");
const bcrypt = require("bcrypt");
const register = require("../models/register");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, profile, status, course_id } =
      req.body;

    const exitsemail= await Register.findOne({email});

    if(exitsemail) return res.status(400).json({message:'Email already exits, Use different email address'})

    // Check if the course exists
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Get the number of installments from the course
    const installments = course.installments || 1; // Default to 1 if not specified

    // Generate due dates (every month from today)
    const dueDates = [];
    const today = new Date();
    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + i);
      dueDates.push({ date: dueDate, status: "pending" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profileImage = req.file ? req.file.filename : null;

    // Create a new user
    const newUser = new Register({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      profile: profileImage,
      status,
      course_id,
      dueDates, // ✅ Store the calculated due dates
    });

    await newUser.save();

    // Populate course_name in response
    const populatedUser = await Register.findById(newUser._id).populate(
      "course_name"
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user: populatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and populate course_name
    const user = await Register.findOne({ email: email }).populate(
      "course_name"
    );

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (user.paymentStatus !== "paid") {
      return res.status(403).json({
        message: "Wait For Admin Approval For Payment Verification",
        error:
          "Your payment is pending. Please complete the payment to proceed.",
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Admin login override
    if (email === "admin@gmail.com" && password === "admin123") {
      user.role = "admin";
    }

    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
        status: user.status,
        course_id: user.course_id,
        course_name: user.course_name?.name || null, // ✅ Include course name
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

// Get User Info
const getUserInfo = async (req, res) => {
  try {
    const user = await Register.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//delete
const deleteUser = async (req, res) => {
  try {
    const user = await Register.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Middleware to check if user is Admin
const checkAdmin = async (req, res, next) => {
  try {
    const user = await Register.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied! Admins Only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await Register.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  checkAdmin,
  getAllUsers,
  deleteUser,
};
