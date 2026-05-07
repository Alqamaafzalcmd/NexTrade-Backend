const mongoose = require("mongoose");
const { positionsSchema } = require("../schemas/positionsSchema");


const PositionsModel = new mongoose.model("position", positionsSchema);

module.exports = {PositionsModel};