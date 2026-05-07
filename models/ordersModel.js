const mongoose = require("mongoose");

const { ordersSchema } = require("../schemas/ordersSchema");

const OrdersModel = new mongoose.model("holding", ordersSchema);

module.exports = {OrdersModel};