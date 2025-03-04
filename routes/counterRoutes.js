const express = require("express");
const { getRegistrationNumber } = require("../controllers/counterController");

const router = express.Router();

router.get("/next-registration", getRegistrationNumber); // API to fetch next registration number

module.exports = router;
