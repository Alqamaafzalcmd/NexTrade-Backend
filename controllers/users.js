const User = require("../models/usersModel");
const Holding = require("../models/holdingsModel");
const Stock = require("../models/stockModel");
const Position = require("../models/positionsModel");

module.exports.addFunds = async (req, res) => {
  const amount = Number(req.body.field);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "valid fund amount is required" });
  }

  let currUser = await User.findById(req.user.id);
  currUser.funds += amount;

  await currUser.save();
  res.status(200).json({
    success: true,
    message: "Funds added successfully.",
  });
};

module.exports.withdrawFunds = async (req, res) => {
  const amount = Number(req.body.field);
  let currUser = await User.findById(req.user.id);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "valid fund amount is required" });
  }
  if (currUser.funds < amount) {
    return res.status(400).json({ message: "insufficient amount to withdraw" });
  }

  currUser.funds -= amount;
  await currUser.save();
  res.status(200).json({
    success: true,
    message: "Funds withdrawn successfully.",
  });
};


module.exports.getInfo = async (req, res) => {
  let funds,
    usedMargin,
    positionValue = 0,
    holdingValue = 0;
  let user = await User.findOne({ _id: req.user.id });
  funds = user.funds;
  usedMargin = user.usedMargin;

  let holding = await Holding.find({ customer: req.user._id });

  let holdingCount = 0;
  let investment = 0;
  for (const h of holding) {
    holdingCount++;
    const stock = await Stock.findOne({ name: h.name });
    holdingValue += h.qty * stock.currentPrice;
    investment += h.qty * h.avg;
  }

  let pnl = holdingValue - investment;
  const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;

  let position = await Position.find({ customer: req.user._id });

  for (const p of position) {
    const stock = await Stock.findOne({ name: p.name });
    positionValue += p.qty * stock.currentPrice;
  }

  res.send({
    funds,
    usedMargin,
    holdingValue,
    positionValue,
    holdingCount,
    investment,
    pnl,
    pnlPercent,
    useremail: user.email,
    username: user.username,
  });
};

