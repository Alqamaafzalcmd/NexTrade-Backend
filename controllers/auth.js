const User = require("../models/usersModel");
const createSecretToken = require("../utils/secretToken");
const bcrypt = require("bcryptjs");

const tokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

module.exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .send({ message: "email, password and username are required" });
  }

  const currUser = await User.findOne({ email });
  if (currUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  await newUser.save();

  const token = createSecretToken(newUser._id);

  res.cookie("token", token, tokenCookieOptions);

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
      (await User.findOne({ username })) || (await User.findOne({ email }));
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

    const token = await createSecretToken(user.id);
    res.cookie("token", token, tokenCookieOptions);

    req.flash("success", "user logged in successfully");
    return res
      .status(200)
      .json({ message: "user logged in successfully", success: true, user });
  } catch (err) {
    return res.status(500).send({ message: err.message, success: false, user });
  }
};

module.exports.vaidateUser = async (req, res) => {
  res.status(201).json({ message: "user is authorized" });
};

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
