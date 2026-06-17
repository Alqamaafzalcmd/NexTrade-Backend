const Order = require("../models/ordersModel");


module.exports.addOrders = async (req, res, next) => {
  // const ordersSchema = new Schema({
  //   name: String,
  //   qty: Number,
  //   price: Number,
  //   mode: String,
  //   customer:{
  //     type:Schema.Types.ObjectId,
  //     ref:"User"
  //   }
  // });

  // creating a order history for or sell
  let newOrder = new Order({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  newOrder.customer = req.user._id;

  newOrder
    .save()
    .catch(() => {});

    next();
};
