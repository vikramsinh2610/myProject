const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const test = async (req, res) => {
  res.json("OK");
};

module.exports = {
  test,
};
