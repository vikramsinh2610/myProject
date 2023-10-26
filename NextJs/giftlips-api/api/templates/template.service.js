const Template = require("./template.model");

const list = async ({ limit = 10, offset = 0 }) => {
  try {
    return await Template.paginate({}, { limit, offset });
  } catch (e) {
    console.log(e);
    return [];
  }
};

const create = async ({ userId, title, description, ...kwargs }) => {
  console.log(kwargs);
  try {
    return await Template.create({
      userId,
      title,
      description,
      ...kwargs,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  list,
  create,
};
