const Order = require("../models/ordersModel");
const User = require("../models/usersModel");
const Holding = require("../models/holdingsModel");
const Position = require("../models/positionsModel");

module.exports.sellOrders = async (req, res, next) => {
  // status --> Pending, Completed, Failed

  // let status = req.body.product === "MIS" ? "Pending" : "Completed";

  let status = "Completed";
  const qty = Number(req.body.qty);
  const product = req.body.product;

  let user = await User.findOne({ _id: req.user._id });

  let holding = await Holding.findOne({
    customer: req.user._id,
    name: req.body.name,
  });

  let position = await Position.findOne({
    customer: req.user._id,
    name: req.body.name,
  });

  if (product === "CNC" && (!holding || qty > holding.qty)) {
    status = "Rejected";
  } else if (product === "MIS" && (!position || qty > position.qty)) {
    status = "Rejected";
  }

  let newOrder = new Order({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
    status: status,
  });

  newOrder.customer = req.user._id;
  await newOrder.save();

  next();
};
