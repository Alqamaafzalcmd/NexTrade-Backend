require('dotenv').config();
const userModel = require('../models/usersModel');
const jwt = require('jsonwebtoken');

module.exports.userVerification = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ status: false, message: "No token" });
    }

    try {
        const data = jwt.verify(token, process.env.TOKEN_KEY);

        const user = await userModel.findById(data.id);

        if (!user) {
            return res.status(401).json({ status: false });
        }
        console.log(user);
        res.send(user);

        req.user = user; // store user for next middleware/route
        // next();

    } catch (err) {
        return res.status(401).json({ status: false });
    }
};