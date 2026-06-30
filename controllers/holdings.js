const Holding = require("../models/holdingsModel");
const Stock = require("../models/stockModel");
const User = require("../models/usersModel");

module.exports.getAll = async (req, res) => {
  const allHoldings = await Holding.find({ customer: req.user.id });
  const name = allHoldings.map((s) => {
    return s.name;
  });

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
};

module.exports.addHolding = async (req, res) => {
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);
  let stock = await Holding.findOne({
    name: req.body.name,
    customer: req.user._id,
  });

  // updating funds and used margin
  let user = await User.findOne({ _id: req.user._id });
  if (user.funds < price * qty) {
    return res.status(400).json({ message: "Insufficient funds" });
  }
  user.funds -= price * qty;
  await user.save();

  if (stock) {
    const newQty = qty + stock.qty;
    const newAvg = (price * qty + stock.avg * stock.qty) / newQty;
    stock.qty = newQty;
    stock.avg = newAvg;
    await stock.save();
  } else {
    const newHolding = {
      name: req.body.name,
      qty,
      avg: price,
    };
    newHolding.customer = req.user._id;
    await Holding.create(newHolding);
  }

  return res.status(201).json({ message: "Holding added successfully" });
};

module.exports.sellHolding = async (req, res) => {
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);
  let holding = await Holding.findOne({
    name: req.body.name,
    customer: req.user._id,
  });
  let user = await User.findOne({ _id: req.user._id });

  if (!holding) {
    return res.status(401).json({ message: "No such stock found" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (holding.qty < qty ) {
    return res.status(401).json({ message: "Not enough stock quantity exist" });
  }

  const sellAmount = price * qty;
  holding.qty -= qty;

  if (holding.qty === 0) {
    await Holding.deleteOne({ name: req.body.name, customer: req.user._id });
  } else {
    await holding.save();
  }

  user.funds += sellAmount;
  await user.save();

  return res.status(201).json({ message: "Stock sold successfully" });
};
