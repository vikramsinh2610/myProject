const CardInvite = require("./cardInvite.model");

const create = async (cardId, email, role, key, inviter) => {
  try {
    return await CardInvite.create({ cardId, email, role, key, inviter });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const checkDuplicate = async (cardId, email) => {
  try {
    return await CardInvite.exists({ cardId, email });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const findOne = async (data) => {
  try {
    return await CardInvite.findOne(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const isAdmin = async (cardId, email) => {
  try {
    return await CardInvite.exists({
      cardId,
      email,
      accepted: true,
      role: "admin",
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const findOneAndDelete = async (data) => {
  try {
    return await CardInvite.findOneAndDelete(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const exists = async (data) => {
  try {
    return await CardInvite.exists(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const find = async (data) => {
  try {
    return await CardInvite.find(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  create,
  checkDuplicate,
  findOne,
  isAdmin,
  findOneAndDelete,
  exists,
  find,
};
