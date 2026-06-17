const mongoose = require("mongoose");

const { ordersSchema } = require("../schemas/ordersSchema");

const Order = new mongoose.model("Order", ordersSchema);

module.exports = Order;