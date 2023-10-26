const Card = require("./card.model");

const list = async ({ userId }, { limit, offset }) => {
  try {
    return await Card.paginate(
      { userId: userId },
      { limit, offset, populate: "template" }
    );
  } catch (e) {
    console.log(e);
    return [];
  }
};

const create = async ({
  userId,
  shortId,
  title,
  description,
  template,
  assets,
}) => {
  try {
    return await Card.create({
      userId,
      shortId,
      title,
      description,
      template,
      assets,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const findById = async (id) => {
  try {
    return await Card.findById(id);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const updateById = async (id, data) => {
  try {
    return await Card.findByIdAndUpdate(id, data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  list,
  create,
  findById,
  updateById,
};
