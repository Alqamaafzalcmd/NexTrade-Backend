const express = require("express");
const router = express.Router();
const { userVerification } = require("../middlewares/authorization")

const Order = require("../models/ordersModel");

router
  .route("/")
     .get(userVerification, async (req, res) => {
       let allOrders = await Order.find({customer:req.user.id});
       res.send(allOrders);
      });



  

module.exports = router;
