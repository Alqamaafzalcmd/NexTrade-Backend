const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
const User = require('../models/usersModel');
const createSecretToken = require('../utils/secretToken');
const bcrypt = require("bcryptjs");
const { userVerification } = require('../middlewares/authorization');
const flash = require('connect-flash');
const userController = require('../controllers/users')



router.route("/signup")
    .post(userController.signup);


router.route("/login")
    .post(userController.login);



router.route("/logout")
    .get((req, res) => {
        res.clearCookie("token");
        res.json({
            success: true,
            message: "Logged out successfully",
        });

    });



router.route("/getusers")
    .get(async (req, res) => {
        let allUser = await User.find({});
        if(allUser){
           res.send(allUser);
        }
        
    })

// router.route("/checkuser")
//     .get(userVerification);


module.exports = router;
