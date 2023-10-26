const Font = require("../fonts/font.model");

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
    const fonts = await Font.paginate(query, options);
    return res.json(fonts);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const create = async (req, res) => {
  const { name, url } = req.body;

  try {
    const font = await Font.create({ name, url });
    return res.json(font);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
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

const getFontLib = async (req, res) => {
  const allFonts = await Font.find({});
  return res.render("font-lib", { allFonts: allFonts });
};

module.exports = {
  list,
  create,
  remove,
  getFontLib,
};
