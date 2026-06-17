const express = require('express');
const router = express.Router();
const Holding = require('../models/holdingsModel');
const {userVerification} = require("../middlewares/authorization");
const Order = require("../models/ordersModel");
const { addOrders} = require("../middlewares/addOrders");


router.route("/")
   .get(userVerification, async (req, res) => {
        let allHoldings = await Holding.find({customer:req.user.id});
        res.send(allHoldings);
   })


router.route("/add")
.post(userVerification,addOrders, async (req, res) => {
  let stock = await Holding.findOne({name:req.body.name});
  
  if(stock){
    const newQty = req.body.qty + stock.qty;
    const newAvg = ((req.body.price * req.body.qty) + (stock.price * stock.qty) / newQty);
    stock.qty = newQty;
    stock.price = req.body.price;
    await stock.save();
  }
  else{
    const avg = req.body.price;
    const changePercent = Math.random() * 10 - 5; // -5% to +5%
    const currentPrice = +(avg * (1 + changePercent / 100)).toFixed(2);
    const net = (((currentPrice - avg) / avg) * 100).toFixed(2);
    const day = (Math.random() * 4 - 2).toFixed(2); // -2% to +2%

    const newHolding = {
      name: req.body.name,
      qty: req.body.qty,
      avg,
      price: currentPrice,
      net: `${net >= 0 ? "+" : ""}${net}%`,
      day: `${day >= 0 ? "+" : ""}${day}%`,
    };
    newHolding.customer = req.user._id;
    await Holding.create(newHolding);

  }



  

});





module.exports = router;
