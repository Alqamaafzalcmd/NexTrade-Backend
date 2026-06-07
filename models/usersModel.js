const mongoose = require('mongoose');
const userSchema = require('../schemas/usersSchema');

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
