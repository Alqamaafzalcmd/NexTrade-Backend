const Stock = require("../models/stockModel");
const User = require("../models/usersModel");
const Position = require("../models/positionsModel");

module.exports.getAll = async (req, res) => {
  const allPositions = await Position.find({ customer: req.user._id });

  const name = allPositions.map((s) => {
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

  const result = allPositions.map((positions) => {
    const stock = stockMap[positions.name];

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
};

module.exports.addPosition = async (req, res) => {
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);
  let stock = await Position.findOne({
    name: req.body.name,
    customer: req.user._id,
  });

  // updating funds and used margin
  let user = await User.findOne({ _id: req.user._id });
  const totalCost = price * qty;

  if (user.funds < totalCost) {
    return res.status(400).json({ message: "Insufficient funds" });
  }
  user.funds -= totalCost;
  user.usedMargin += totalCost;
  await user.save();

  if (stock) {
    const newQty = qty + stock.qty;
    const newAvg = (price * qty + stock.avg * stock.qty) / newQty;
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
};

module.exports.sellPosition = async (req, res) => {
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);

  let position = await Position.findOne({
    name: req.body.name,
    customer: req.user._id,
  });
  let user = await User.findOne({ _id: req.user._id });

  if (!position) {
    return res.status(401).json({ message: "No such stock found" });
  }

  if (!user) {
    return res.status(401).json({ message: "User does not exist" });
  }

  if (position.qty < qty) {
    return res.status(401).json({ message: "Not enough stock quantity exist" });
  }

  // const pnl = (req.body.price - position.avg) * req.body.qty;
  const sellAmount = price * qty;
  const blockedAmount = qty * position.avg;

  user.funds += sellAmount;
  user.usedMargin -= blockedAmount;
  position.qty -= qty;

  if (position.qty == 0) {
    await Position.deleteOne({
      name: req.body.name,
      customer: req.user._id,
    });
  } else {
    await position.save();
  }

  await user.save();
  return res.status(201).json({ message: "Stock sold successfull" });
};
