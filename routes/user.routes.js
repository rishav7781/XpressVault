const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");

// Render register page
router.get("/register", (req, res) => {
    res.render("register");
});

// Register route
router.post(
    "/register",
    [
        body("email").trim().isEmail().withMessage("Invalid email"),
        body("username").trim().isLength({ min: 5 }).withMessage("Username must be at least 5 characters"),
        body("password").trim().isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password, username } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                email,
                username,
                password: hashedPassword,
            });

            res.status(201).json({ message: "User registered", user: newUser });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Render login page
router.get("/login", (req, res) => {
    res.render("login");
});

// Login route
router.post(
    "/login",
    [
        body("username").trim().isLength({ min: 5 }).withMessage("Username too short"),
        body("password").trim().isLength({ min: 5 }).withMessage("Password too short"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: "Username or password incorrect" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const payload = {
                userId: user._id.toString(),
                email: user.email,
                username: user.username,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            res.send("User logged in successfully");
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;
