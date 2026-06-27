const Order = require("../models/ordersModel");
const User = require("../models/usersModel");


module.exports.getAll = async (req, res) => {
  let allOrders = await Order.find({ customer: req.user.id });
  res.send(allOrders);
};
