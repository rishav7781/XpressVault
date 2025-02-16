const mongoose = require('mongoose');
require('dotenv').config();

function connectToDB() {
    if (!process.env.MONGO_URI) {
        console.error("❌ MONGO_URI is not set in .env file");
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("✅ Connected to DB"))
        .catch((err) => {
            console.error("❌ Database Connection Failed:", err.message);
            process.exit(1);
        });
}

module.exports = connectToDB;
