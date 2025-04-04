const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", verified);

        req.user = verified; // This should include userId, username, email
        next();
    } catch (error) {
        console.error("❌ Invalid Token:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = authenticateUser;
