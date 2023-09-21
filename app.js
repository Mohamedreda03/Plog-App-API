const express = require("express");
require("dotenv").config();
const connectDB = require("./connectDB/connectDB");
const userRoute = require("./router/user.router");
const cors = require("cors");

const app = express();

app.use(cors());

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(express.json());

app.use("/api/users", userRoute);

// --------------------------------
// Connect to database

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(process.env.PORT, () => {
            console.log(`listening on http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

start();
// --------------------------------
