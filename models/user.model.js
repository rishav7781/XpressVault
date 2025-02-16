const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minlength: [5, "Username must be at least 5 characters long"],
        trim: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        minlength: [13, "email must be at least 13 characters long"],

        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Invalid email format"] // Regex for email validation
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: [5, "Password must be at least 5 characters long"]
    }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const User = mongoose.model("User", userSchema);
module.exports = User;
