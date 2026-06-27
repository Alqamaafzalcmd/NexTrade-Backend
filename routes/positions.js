const express = require("express");
const router = express.Router();
const { addOrders } = require("../middlewares/addOrders");
const {sellOrders} = require("../middlewares/sellOrders");
const Position = require("../models/positionsModel");
const Stock = require("../models/stockModel");
const User = require("../models/usersModel");
const { userVerification } = require("../middlewares/authorization");
const positionController = require("../controllers/positions")

router.route("/").get(userVerification, positionController.getAll);

router.route("/add").post(userVerification, addOrders, positionController.addPosition);

router.route("/sell")
  .post(userVerification, sellOrders, positionController.sellPosition);


module.exports = router;
