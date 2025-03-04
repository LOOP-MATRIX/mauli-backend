const express = require('express')
const cors= require('cors')
const dotenv  = require('dotenv')
const connectDB = require('./config/db')
const faultyroute = require('./routes/facultyRoute')
const registerRoutes = require("./routes/registerRoute");
const courseAdmissionRoutes = require("./routes/courseAdmissionRoute");
const courseRoute = require('./routes/courseRoute')
const batchRoute = require('./routes/batchRoute')
const videoRoute  =require('./routes/videoRoute')
const qrRoute = require('./routes/qrRoute')
const counterRoutes = require("./routes/counterRoutes");
require('./cron/batchVideoAccess')
require('./cron/payment')

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static("images"));
app.use("/uploads",express.static("uploads"))


connectDB()

//Routes
app.use('/faculty',faultyroute)
app.use("/users", registerRoutes);
app.use("/courseAdmission", courseAdmissionRoutes);
app.use('/course',courseRoute)
app.use('/batch',batchRoute)
app.use('/video',videoRoute)
app.use('/qr',qrRoute)
app.use("/api/counter", counterRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})