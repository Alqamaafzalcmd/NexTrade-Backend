const express = require("express");
const authController = require("../controllers/auth");
const {userVerification} = require("../middlewares/authorization");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser());

router.route("/").get(userVerification, authController.vaidateUser);

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

router.route("/logout").get(authController.logout);

module.exports = router;
