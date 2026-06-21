const Order = require("../models/ordersModel");

module.exports.addOrders = async (req, res, next) => {

  // status --> Pending, Completed, Failed
  console.log("adding order");

  let status = req.body.product === "MIS" ? "Pending" : "Completed";

  let newOrder = new Order({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
    status:status,
  });

  newOrder.customer = req.user._id;

  newOrder.save().catch(() => {});

  next();
};
