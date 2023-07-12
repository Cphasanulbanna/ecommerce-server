const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//routes
const userRoute = require("./routes/authRoute");

const { connectDb } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

connectDb();

//endpoints
app.use("/api/auth/", userRoute);

app.listen(PORT, () => console.log(`Server is running on port:${[PORT]}`));
