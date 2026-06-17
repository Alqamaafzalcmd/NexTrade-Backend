const mongoose = require('mongoose');
const userSchema = require('../schemas/usersSchema');

const User = mongoose.model("User", userSchema);

module.exports = User;
