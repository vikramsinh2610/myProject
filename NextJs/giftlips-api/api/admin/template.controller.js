const Template = require("../templates/template.model");

const list = async (req, res) => {
  const { search, page, limit } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [{ title: { $regex: search } }, { description: { $regex: search } }],
    };
  }

  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    sort: { updatedAt: -1 },
  };

  try {
    const paginated = await Template.paginate(query, options);
    return res.json(paginated);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const create = async (req, res) => {
  const { sub } = req.auth;
  const data = req.body;

  try {
    const slug = await Template.findOne({slug: req.body.slug});
    if (slug) {
      return res.status(400).json({
        success: false,
        message: "Please enter different name"
      })
    }
    const template = await Template.create({ userId: sub, ...data });
    return res.json(template);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const update = async (req, res) => {
  const { templateId } = req.params;
  const data = req.body;

  try {
    const template = await Template.findByIdAndUpdate(templateId, { ...data });
    return res.json(template);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const remove = async (req, res) => {
  const { templateId } = req.params;

  try {
    const template = await Template.findByIdAndUpdate(templateId, {
      isDeleted: true,
    });
    return res.json(template);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const getPopularTemplate = async (req, res) => {
  try {
    const templateDetails = await Template.find({ popular: { $exists: true } });
    if (templateDetails.length < 0) {
      return res.status(404).json({
        success: false,
        message: "There is no popular template.",
      });
    }
    templateDetails.sort((a, b) => b.popular - a.popular);
    return res.status(200).json({
      success: true,
      data: templateDetails,
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
  create,
  update,
  remove,
  getPopularTemplate
};
