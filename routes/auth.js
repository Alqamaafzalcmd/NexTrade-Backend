const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("../controllers/auth");

const router = express.Router();

router.use(cookieParser());

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

router.route("/logout").get((req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
