const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, },
    phone: { type: String,},
    role: { type: String, enum: ["user", "admin"], default: "user" } // Role field
});

module.exports = mongoose.model("Register", RegisterSchema);
