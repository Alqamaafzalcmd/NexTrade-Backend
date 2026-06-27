const express = require('express');
const router = express.Router();
const Holding = require('../models/holdingsModel');
const Stock = require("../models/stockModel");
const Order = require("../models/ordersModel");
const User = require("../models/usersModel");
const {userVerification} = require("../middlewares/authorization");
const { addOrders} = require("../middlewares/addOrders");
const { sellOrders } = require("../middlewares/sellOrders");
const holdingController = require("../controllers/holdings")



router.route("/")
   .get(userVerification, holdingController.getAll);


router.route("/add")
.post(userVerification, addOrders, holdingController.addHolding );

router.route("/sell")
  .post(userVerification, sellOrders, holdingController.sellHolding );



module.exports = router;
