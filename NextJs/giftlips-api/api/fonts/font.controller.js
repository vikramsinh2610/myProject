const { query } = require("express");
const Font = require("./font.model");

const create = async (req, res) => {
  const { name, url } = req.body;
  try {
    const newFont = await Font.create({ name, url });
    res.json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const list = async (req, res) => {
  const { search, page, limit } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [{ name: { $regex: search } }, { url: { $regex: search } }],
    };
  }

  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    sort: { updatedAt: -1 },
  };

  try {
    const paginated = await Font.paginate(query, options);
    return res.json(paginated);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const getFontLib = async (req, res) => {
  let query = {};
  const allFonts = await Font.find(query);
  res.render("font-lib", { allFonts: allFonts });
};

const remove = async (req, res) => {
  const { fontId, url } = req.body;
  let query;

  if (fontId) {
    query = { _id: fontId };
  } else {
    query = { url };
  }

  try {
    const font = await Font.findOneAndDelete(query);
    return res.json(font);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

module.exports = {
  list,
  create,
  getFontLib,
  remove,
};
