const express = require("express");
const dotenv = require("dotenv");
dotenv.config();  // ✅ Sabse upar load karna zaroori hai!

const connectToDB = require("./config/db");
const cookieParser = require("cookie-parser");

const UserRouter = require("./routes/user.routes");
const IndexRouter = require("./routes/index.routes");
const StorageRouter = require("./routes/storage.routes"); // ✅ Storage route add kiya

connectToDB();

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", IndexRouter);
app.use("/user", UserRouter);
app.use("/storage", StorageRouter); // ✅ Storage route yahan bhi add kiya

app.listen(3000, () => {
    console.log("🚀 Server is running on port 3000");
});
