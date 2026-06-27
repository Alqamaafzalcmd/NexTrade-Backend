const Order = require("../models/ordersModel");
const User = require("../models/usersModel");

module.exports.addOrders = async (req, res, next) => {
  let status = "Completed";

  let user = await User.findOne({_id: req.user._id });

  if (req.body.mode === "BUY" &&
     user.funds < req.body.price) {
    status = "Rejected";
  }


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
