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
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);
  let stock = await Holding.findOne({ name: req.body.name, customer: req.user._id });


  // updating funds and used margin
  let user = await User.findOne({ _id: req.user._id });
  if (user.funds < price) {
    return res.status(400).json({message:"Insufficient funds"});
  } 
  // console.log("funds rejected");
  user.funds -= price;
  await user.save();
  console.log("saving user");


  if (stock) {
    const newQty = qty + stock.qty;
    const newAvg = ((price * qty) + (stock.avg * stock.qty)) / newQty;
    stock.qty = newQty;
    stock.avg = newAvg;
    await stock.save();
  } else {
    const newHolding = {
      name: req.body.name,
      qty,
      avg: price,
    };
    // console.log(newHolding);
    newHolding.customer = req.user._id;
    await Holding.create(newHolding);
  }

  return res.status(201).json({ message: "Holding added successfully" });
});

router.route("/sell")
  .post(userVerification, addOrders,async (req, res) => {
       console.log("selling stock from holding ......");
       console.log(req.body);
        // res.send("stock sold")
        console.log(req.user);
       let holding = await Holding.findOne({name:req.body.name, customer:req.user._id})
       let user = await User.findOne({_id:req.user._id});
       console.log(user)

       if (!holding) {
         return res
           .status(401)
           .json({ message: "No such stock found" });
       }

       if (holding.qty < req.body.qty) {
         return res
           .status(401)
           .json({ message: "Not enough stock quantity exist" });
       }

      const sellAmount = req.body.price * req.body.qty;
     

      holding.qty -= req.body.qty;
      
      if (holding.qty == 0) {
        await Holding.deleteOne({name:req.body.name, customer:req.user._id});
      }
      await holding.save();
    


      user.funds += sellAmount;
      await user.save();


      return res.status(201).json({message : "Stock sold successfullu"});
  });



module.exports = router;
