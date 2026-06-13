const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
const userModel = require('../models/usersModel');
const createSecretToken = require('../utils/secretToken');
const bcrypt = require("bcryptjs");
const { userVerification } = require('../middlewares/authorization');
const flash = require('connect-flash');


router.route("/signup")
    .post(async (req, res) => {

        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).send({ message: "email, password and username are required" });
            // throw new ExpressError(400, 'email, password and username are required');
        }

        const currUser = await userModel.findOne({ email });
        if (currUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = new userModel({
            email: email,
            password: password,
            username: username,
            createdAt: new Date()
        });

        await newUser.save();


        const token = createSecretToken(newUser._id);

        res.cookie("token", token, {
            withCredentials: true, // cross origin cookie sharing
            httpOnly: false, // Not safe: JS can read cookie via document.cookie
            expires: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
            ),
        });



        // console.log("user signup successful");
        req.flash("success", `Welcome ${newUser.username} to NexTrade`);
        // console.log(newUser);
        // res.send(res.getHeader('Set-Cookie'));
        return res.status(201).send({ message: "User signed in successfully", success: true, newUser });
     
    });


router.route("/login")
    .post(async (req, res) => {
        try {
            const { username_email: username, username_email: email, password } = req.body;

            if ((!email || !username) &&  !password) {
                return res.status(400).json({ message: "username/email and password are required" });
            }

            // console.log(req.body);
            // res.send(req.body);

            const user = await userModel.findOne({ email }) || await userModel.findOne({ username });
            // console.log(user);

            if (!user) {
                console.log("user does not exist");
                return res.status(401).json({ message: "incorrect username/email or password" });
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ message: "incorrect username/email or password" });
            }

            // Generate new token and set cookie
            const token = await createSecretToken(user._id);
            // console.log(token);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
                expires: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                ),
            });

            // console.log(res.getHeader('Set-Cookie'));
            // console.log("user is logged in successfully");
            req.flash("success", "user logged in successfully");
            return res.status(200).json({ message: "user logged in successfully", success: true, user });

        }
        catch (err) {
            // console.error(err);
            return res.status(500).send({ message: err.message , success: false, user });
        }
    });



router.route("/logout")
    .get((req, res) => {
        res.clearCookie("token");
        console.log("user logout successfully");
        console.log(req.cookies);
        res.json({
            success: true,
            message: "Logged out successfully",
        });

    });


// router.route("/checkuser")
//     .get(userVerification);


module.exports = router;