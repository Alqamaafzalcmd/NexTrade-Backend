const express = require("express");
const router = express.Router();
const { addOrders } = require("../middlewares/addOrders");
const Position = require("../models/positionsModel");
const Stock = require("../models/stockModel");
const User = require("../models/usersModel");
const { userVerification } = require("../middlewares/authorization");

router.route("/").get(userVerification, async (req, res) => {
  // console.log(req)
  const allPositions = await Position.find({ customer: req.user._id });
  // res.send(allPositions);

  const name = allPositions.map((s) => {
    return s.name;
  });

  const stocks = await Stock.find({
    name: { $in: name },
  });

  // res.send(stocks);

  // mapping symbol with full stock details
  const stockMap = {};
  stocks.forEach((stock) => {
    stockMap[stock.name] = stock;
  });

  const result = allPositions.map((positions) => {
    const stock = stockMap[positions.name];
    // console.log(stock);

    return {
      product: "MIS",
      instrument: positions.name,
      qty: positions.qty,
      avgCost: positions.avg,
      ltp: stock.currentPrice,
      currentValue: stock.currentPrice * positions.qty,
      pnl: (stock.currentPrice - positions.avg) * positions.qty,
      netChange: stock.changePercent,
      dayChange: (stock.currentPrice - stock.previousClose) * positions.qty,
    };
  });

  res.send(result);
});

router.route("/add").post(userVerification, addOrders, async (req, res) => {
  console.log("in positions ....");

  const qty = Number(req.body.qty);
  const price = Number(req.body.price);
  let stock = await Position.findOne({ name: req.body.name, customer: req.user._id });

  // updating funds and used margin
  let user = await User.findOne({ _id: req.user._id });
  const totalCost = price;

  if (user.funds < totalCost) {
   return  res.status(400).json({ message: "Insufficient funds" });
  }
  user.funds -= totalCost;
  user.usedMargin += totalCost;
  await user.save();

  if (stock) {
    const newQty = qty + stock.qty;
    const newAvg = ((price * qty) + (stock.avg * stock.qty)) / newQty;
    stock.qty = newQty;
    stock.avg = newAvg;
    stock.price = price;
    await stock.save();
  } else {
    const newPostions = {
      product: req.body.product,
      name: req.body.name,
      qty,
      avg: price,
      price,
    };
    newPostions.customer = req.user._id;
    await Position.create(newPostions);
  }

  return res.status(201).json({ message: "Position added successfully" });
});

module.exports = router;
