const mongoose = require("mongoose");

const { ordersSchema } = require("../schemas/ordersSchema");

const OrdersModel = new mongoose.model("Order", ordersSchema);

module.exports = {OrdersModel};