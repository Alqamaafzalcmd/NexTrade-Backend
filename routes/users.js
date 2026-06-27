const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const Position = require("../models/positionsModel");
const Holding = require("../models/holdingsModel");
const Stock = require("../models/stockModel")
const { userVerification } = require("../middlewares/authorization");
const userController = require("../controllers/users");

router.route("/addfunds").post(userVerification, userController.addFunds);

router.route("/withdrawfunds").post(userVerification, userController.withdrawFunds);

router.route("/info")
     .get(userVerification, userController.getInfo);

module.exports = router;
