const express = require('express');
const router = express.Router();
const Holding = require('../models/holdingsModel');
const {userVerification} = require("../middlewares/authorization");
const Order = require("../models/ordersModel");
const User = require("../models/usersModel");
const { addOrders} = require("../middlewares/addOrders");
const Stock = require("../models/stockModel");


router.route("/")
   .get(userVerification, async (req, res) => {

        const allHoldings = await Holding.find({customer:req.user.id});
        // res.send(allHoldings)
        const name = allHoldings.map((s) => {return s.name});

        const stocks = await Stock.find({
          name: { $in: name },
        });


        // mapping symbol with full stock details
        const stockMap = {};
        stocks.forEach((stock) => {
          stockMap[stock.name] = stock;
        });


        const result = allHoldings.map((holding) => {
          const stock = stockMap[holding.name];
          // console.log(stock);

          return {
            instrument: holding.name,
            qty: holding.qty,
            avgCost: holding.avg,
            ltp: stock.currentPrice,
            currentValue: stock.currentPrice * holding.qty,
            pnl: (stock.currentPrice - holding.avg) * holding.qty,
            netChange: stock.changePercent,
            dayChange: (stock.currentPrice - stock.previousClose) * holding.qty,
          };
        });

        res.send(result);
        
   })


router.route("/add")
.post(userVerification, addOrders, async (req, res) => {
  console.log("in holdings");
  console.log(req.body)
  let stock = await Holding.findOne({ name: req.body.name });


  // updating funds and used margin
  let user = await User.findOne({ _id: req.user._id });
  console.log(user);
  user.funds -= req.body.price;
  await user.save();



  if (stock) {
    const newQty = req.body.qty + stock.qty;
    const newAvg =
      req.body.price * req.body.qty + (stock.price * stock.qty) / newQty;
    stock.qty = newQty;
    stock.price = req.body.price;
    await stock.save();
  } else {
    const newHolding = {
      name: req.body.name,
      qty: req.body.qty,
      avg: req.body.price,
    };
    // console.log(newHolding);
    newHolding.customer = req.user._id;
    await Holding.create(newHolding);
  }
});





module.exports = router;
