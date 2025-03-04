const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["user", "admin", "student"], default: "user" },
  profile: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "pending"],
    default: "unpaid",
  }, 
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

  // ✅ New field to store due dates for installments
  dueDates: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["pending", "paid"], default: "pending" },
    },
  ],
});

RegisterSchema.virtual("course_name", {
  ref: "Course",
  localField: "course_id",
  foreignField: "_id",
  justOne: true,
  options: { select: "name" },
});

module.exports = mongoose.model("Register", RegisterSchema);
