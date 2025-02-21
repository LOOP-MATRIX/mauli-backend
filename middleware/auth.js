const express = require('express');
const app = express();

exports.authRole = (req, res, next) => {
    const role = req.headers["authorization"];

    if (role === "admin") {
        console.log("Access granted to admin");
        next();
    } else {
        console.log("Access denied for role:", role);
        res.status(403).send("Access denied");
    }
};
