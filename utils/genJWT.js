const jwt = require("jsonwebtoken");

module.exports = (paylod) => {
    const token = jwt.sign(paylod, process.env.SECRET_KEY);
    return token;
};
