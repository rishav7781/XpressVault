const express = require("express");
const authMiddleware = require("../middlewares/authe");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const filemodels = require("../models/files.models");

const router = express.Router();

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Render Home Page
router.get("/home", authMiddleware, (req, res) => {
  res.render("home");
});

// File Upload Route
router.post("/storage/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileName = `${Date.now()}_${file.originalname}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("xpressvault-storage")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const fileUrl = `https://ryjerjhlopmnasixsbph.supabase.co/storage/v1/object/public/xpressvault-storage/${fileName}`;

    // Save metadata to MongoDB
    const newFile = await filemodels.create({
      userId: req.user.userId,
      fileName: file.originalname,
      fileUrl,
    });

    // Send response
    res.json({ 
      success: true, 
      message: "File saved successfully in DB", 
      fileUrl: newFile.fileUrl 
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
