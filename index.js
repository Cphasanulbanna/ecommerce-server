const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const { connectDb } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

//DEMO
const options = {
    origin: "http://127.0.0.1:5173",
    credentials: true,
};

//middlewares
app.use(cors(options));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

connectDb();

//endpoints
app.use("/api/auth/", authRoute);
app.use("/api/user/", userRoute);

app.listen(PORT, () => console.log(`Server is running on port:${[PORT]}`));
