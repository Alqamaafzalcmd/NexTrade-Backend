require('dotenv').config();
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');



module.exports.userVerification = async (req, res, next) => {
    // console.log("in middleware ....")
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
        return res.status(401).json({ status: false, message: "No token" });
    }

    try {
        const data = jwt.verify(token, process.env.TOKEN_KEY);

        const user = await User.findById(data.id);

        if (!user) {
            return res.status(401).json({ status: false });
        }

        req.user = user; // store user for next middleware/route
        // console.log("at the end of middleware");
        next();

    } catch (err) {
        // console.log(err);
        return res.status(401).json({ status: false });
    }
};
