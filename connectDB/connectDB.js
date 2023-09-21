const mongoose = require("mongoose");

const connectDB = async (url) => {
    await mongoose.connect(url).then(() => {
        console.log("connected to database");
    });
};

module.exports = connectDB;
