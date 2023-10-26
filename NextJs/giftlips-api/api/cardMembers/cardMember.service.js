const CardMember = require("./cardMember.model");

const create = async (cardId, userId) => {
  try {
    return await CardMember.create({ cardId, userId });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const findOne = async (data) => {
  try {
    return await CardMember.findOne(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = { create, findOne };
