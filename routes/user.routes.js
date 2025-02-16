const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const User = require('../models/user.model')// Corrected model path

// Render registration page (if using EJS or another template engine)
router.get("/register", (req, res) => {
    res.render("register");
});

// Registration route with validation
router.post(
    "/register",
    [
        body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format"),

        body("username")
            .trim()
            .isLength({ min: 5 })
            .withMessage("Username must be at least 5 characters long"),

        body("password")
            .trim()
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters long"),
    ],
    async (req, res) => {
        console.log("Received Data:", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password, username } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create and save new user
            const newUser = await User.create({
                email,
                username,
                password: hashedPassword, // Store hashed password
            });

            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;
