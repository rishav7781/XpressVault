const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

// 🔹 Supabase Client Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 🔹 Multer Setup (File Upload Handling)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 📌 File Upload API (Supabase Storage)
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

        // 🔹 Generate Unique Filename (Timestamp + Random ID)
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}_${file.originalname}`;


        // 🔹 Supabase Storage Me Upload Karna
        const { data, error } = await supabase.storage
            .from("xpressvault-storage") // 👈 Apna bucket name yahan dal
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) throw error;

        // ✅ Public URL ko dynamically fetch karna
        const { data: publicUrlData } = supabase.storage
            .from("xpressvault-storage")
            .getPublicUrl(fileName);

        res.json({ success: true, fileUrl: publicUrlData.publicUrl });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
