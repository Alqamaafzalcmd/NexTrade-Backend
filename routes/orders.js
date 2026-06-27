const express = require("express");
const router = express.Router();
const { userVerification } = require("../middlewares/authorization")
const Order = require("../models/ordersModel");
const orderController = require("../controllers/orders")

router
  .route("/")
     .get(userVerification, orderController.getAll);



  

module.exports = router;
