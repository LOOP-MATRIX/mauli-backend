const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("../models/register"); // Update with your user model path

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🔄 Running due date check...");

    // Get current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-based index (0 = Jan, 11 = Dec)

    // Fetch all users
    const users = await User.find();

    for (let user of users) {
      let hasOverduePayment = false;

      if (user.dueDates && user.dueDates.length > 0) {
        user.dueDates.forEach((dueDate) => {
          const due = new Date(dueDate.date);
          const dueYear = due.getFullYear();
          const dueMonth = due.getMonth();

          // Check if due date is in the current month and has passed
          if (
            dueYear === currentYear &&
            dueMonth === currentMonth &&
            due < today &&
            dueDate.status === "pending"
          ) {
            hasOverduePayment = true;
          }
        });
      }

      // If any overdue payment is found, update paymentStatus to "unpaid"
      if (hasOverduePayment) {
        await User.findByIdAndUpdate(user._id, { paymentStatus: "unpaid" });
        console.log(`❌ Payment status set to "unpaid" for ${user.name}`);
      }
    }

    console.log("✅ Due date check completed.");
  } catch (error) {
    console.error("❌ Error running due date cron job:", error);
  }
});
