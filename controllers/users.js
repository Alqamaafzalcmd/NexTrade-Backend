const User = require("../models/usersModel");
const express = require('express');
const cookieParser = require('cookie-parser');
const createSecretToken = require('../utils/secretToken');
const bcrypt = require("bcryptjs");
const { userVerification } = require('../middlewares/authorization');
const userController = require('../controllers/users')

module.exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .send({ message: "email, password and username are required" });
    // throw new ExpressError(400, 'email, password and username are required');
  }

  const currUser = await User.findOne({ email });
  if (currUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }
  // username: "alqma123",
  //   email: "alqama@gmail.com",
  //   password: "12345###",
  const newUser = new User({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
  })

  await newUser.save();

  const token = createSecretToken(newUser._id);

  res.cookie("token", token, {
    withCredentials: true, // cross origin cookie sharing
    httpOnly: false, // Not safe: JS can read cookie via document.cookie
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  req.flash("success", `Welcome ${newUser.username} to NexTrade`);
  return res
    .status(201)
    .send({ message: "User signed in successfully", success: true, newUser });
};



module.exports.login = async (req, res) => {
  try {
    const {
      username_email: username,
      username_email: email,
      password,
    } = req.body;

    if ((!email || !username) && !password) {
      return res
        .status(400)
        .json({ message: "username/email and password are required" });
    }

    const user =
      (await User.findOne({ email })) ||
      (await User.findOne({ username }));

    if (!user) {
      return res
        .status(401)
        .json({ message: "incorrect username/email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "incorrect username/email or password" });
    }

    // Generate new token and set cookie
    const token = await createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    req.flash("success", "user logged in successfully");
    return res
      .status(200)
      .json({ message: "user logged in successfully", success: true, user });
  } catch (err) {
    return res.status(500).send({ message: err.message, success: false, user });
  }
};
