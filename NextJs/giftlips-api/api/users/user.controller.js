const User = require("./user.model");
const Card = require("../cards/card.model");
const moment = require("moment");

const list = async (req, res) => {
  const { search, page, limit } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { email: { $regex: search } },
        { firstName: { $regex: search } },
        { lastName: { $regex: search } },
      ],
    };
  }

  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    sort: { updatedAt: -1 },
    projection: {
      password: 0,
    },
  };

  try {
    const paginated = await User.paginate(query, options);
    return res.json(paginated);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const get = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (e) {
    console.log(e);
  }
};

const changeRole = async (req, res) => {
  const { userId } = req.params;
  const { isStaff } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { isStaff });
    res.json(user);
  } catch (e) {
    console.log(e);
  }
};

const cards = async (req, res) => {
  const { userId } = req.params;
  const { search, page, limit } = req.query;
  let query = { userId };

  if (search) {
    query = {
      userId,
      $or: [
        { title: { $regex: search } },
        { description: { $regex: search } },
        { status: { $regex: search } },
      ],
    };
  }

  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    sort: { updatedAt: -1 },
    populate: "template",
  };

  try {
    const paginated = await Card.paginate(query, options);
    return res.json(paginated);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

module.exports = {
  list,
  get,
  changeRole,
  cards
};
