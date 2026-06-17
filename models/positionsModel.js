const mongoose = require("mongoose");
const { positionsSchema } = require("../schemas/positionsSchema");


const Position = new mongoose.model("Position", positionsSchema);

module.exports = Position;