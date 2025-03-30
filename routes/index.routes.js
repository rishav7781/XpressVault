const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/upload", (req, res) => {
    res.render("upload");  // ✅ Upload page serve karega
});

module.exports = router;
