const TemplateService = require("./template.service");
const Template = require("./template.model");

const list = async (req, res) => {
  const { search, category, page, limit } = req.query;
  let query = { isEnabled: true };

  if (search) {
    query = {
      isEnabled: true,
      $or: [{ title: { $regex: search } }, { description: { $regex: search } }],
    };
  }

  if (category) {
    query = {
      isEnabled: true,
      categories: category,
    };
  }

  const options = {
    limit: parseInt(limit) || 12,
    page: parseInt(page) || 1,
    sort: { position: 1 },
  };

  try {
    const paginated = await Template.paginate(query, options);
    return res.json(paginated);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  const item = await Template.findById(id);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json("Not found");
  }
};
const getBySlug = async (req, res) => {
  const { slug } = req.params;
  const item = await Template.findOne({ slug });

  if (item) {
    res.json(item);
  } else {
    res.status(404).json("Not found");
  }
};

const create = async (req, res) => {
  const user = req.auth;
  let data = req.body;
  let item = await TemplateService.create({ userId: user.sub, ...data });
  if (item) {
    res.json(item);
  } else {
    res.json("Failed to create item.");
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    let item = await Template.findById(id);
    item.slug = req.body.slug || item.slug;
    item.title = req.body.title || item.title;
    item.description = req.body.description || item.description;
    item.coverUrl = req.body.coverUrl || item.coverUrl;
    item.width = req.body.width || item.width;
    item.height = req.body.height || item.height;
    item.qrWidth = req.body.qrWidth || item.qrWidth;
    item.qrFrame = req.body.qrFrame || item.qrFrame;
    item.qrX = req.body.qrX || item.qrX;
    item.qrY = req.body.qrY || item.qrY;
    item.qrFrameColor = req.body.qrFrameColor || item.qrFrameColor;
    item.assets = req.body.assets || item.assets;
    item.attributes = req.body.attributes || item.attributes;
    item.categories = req.body.categories || item.categories;
    item.tags = req.body.tags || item.tags;
    item.variables = req.body.variables || item.variables;
    if (item.assets && item.assets.length) {
      item.coverUrl = item.assets[0].url;
    }
    await item.save();
    res.json(item);
  } catch (e) {
    res.json("Failed to update item.");
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    let item = await Template.findByIdAndUpdate(id, { isDeleted: true });
    res.json("OK");
  } catch (e) {
    res.status(400).json("Failed to update item.");
  }
};

const getAll = async (req, res) => {
  try {
    const templates = await Template.find({}, "slug title coverUrl position").sort({
      position: 1,
    });

    return res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error,
    });
  }
};

const setPositions = async (req, res) => {
  const { templates } = req.body;

  if (!templates) {
    return res.status(400).json({
      success: false,
      message: "Please enter required details.",
    });
  }

  try {
    templates.forEach(async (template, index) => {
      await Template.findByIdAndUpdate(template._id, {
        position: index + 1,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Templates successfully rearranged.",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error,
    });
  }
};

module.exports = {
  list,
  get,
  getBySlug,
  create,
  update,
  deleteItem,
  getAll,
  setPositions,
};
