const Register = require('../models/register');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body; // Accept role in request
        
        // Check if user already exists
        const existingUser = await Register.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user (default role is "user" unless specified as "admin")
        const newUser = new Register({ 
            name, 
            email, 
            password: hashedPassword, 
            phone, 
            role: role || "user"  // Default role: "user"
        });

        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully", user: newUser });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}

// Login a user

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Register.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        // If email and password match predefined admin credentials, set role to "admin"
        if (email === "admin@gmail.com" && password === "admin123") {
            user.role = "admin"; // Ensure role is admin
        }

        res.status(200).json({
            message: "Login Successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
};





// Get User Info (using user ID from params)
const getUserInfo = async (req, res) => {
    try {
        const user = await Register.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
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

module.exports = { registerUser, loginUser, getUserInfo, checkAdmin };
