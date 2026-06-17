const express = require("express");
const router = express.Router();

const Order = require("../models/ordersModel");

router
  .route("/")
     .get(async (req, res) => {
       let allOrders = await Order.find({});
       res.send(allOrders);
      });

  

module.exports = router;
