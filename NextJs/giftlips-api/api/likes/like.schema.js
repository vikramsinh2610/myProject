const { Joi } = require("express-validation");

const postLike = {
  body: Joi.object({
    entryId: Joi.string().required()
  }),
};

module.exports = {
  postLike,
};
