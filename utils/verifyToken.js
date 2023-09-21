const jwt = require("jsonwebtoken");

module.exports = async (data) => {
    const arr = data.split(" ");
    const token = arr[1];
    const result = await jwt.verify(token, process.env.SECRET_KEY);
    return result;
};
