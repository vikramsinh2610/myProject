const { Joi } = require("express-validation");

const createCardValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    template: Joi.string().required(),
    assets: Joi.array().optional(),
  }),
};

const signValidation = {
  body: Joi.object({
    uploadKey: Joi.string().required(),
    type: Joi.string().optional(),
  }),
};

const loginValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    firstName: Joi.string().empty("").optional(),
    lastName: Joi.string().empty("").optional(),
    password: Joi.string().required(),
    cardId: Joi.string().empty("").optional(),
  }),
};

const registerValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string().required(),
    newsletterOptIn: Joi.bool().default(true),
    cardId: Joi.string().empty("").optional(),
    location: {
      countryCode: Joi.string(),
      countryName: Joi.string(),
      city: Joi.string(),
      postal: Joi.string(),
      latitude: Joi.string(),
      longtitude: Joi.string(),
      IPv4: Joi.string(),
      state: Joi.string()
    }
  }),
};

const createCardCheckoutSession = {
  body: Joi.object({
    items: Joi.array(),
    cardId: Joi.string(),
    stripeSuccessUrl: Joi.string().optional(),
    stripeCancelUrl: Joi.string(),
  }),
};
const PurchaseAddon = {
  body: Joi.object({
    cardId: Joi.string(),
    printShip: Joi.number().empty().optional(),
    years: Joi.number().empty().optional(),
    videos: Joi.number().empty().optional(),
    users: Joi.number().empty().optional(),
    couponId: Joi.string().empty().optional(),
    promoId: Joi.string().empty().optional()
  }),
};

const updateProfileValidation = {
  body: Joi.object({
    email: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string().empty("").optional().allow(null),
    phone: Joi.string().empty("").optional().allow(null),
    smsCountryCode: Joi.string().empty("").optional().allow(null),
    countryCode: Joi.string().empty("").optional().allow(null),
    profilePhoto: Joi.string().empty("").optional(),
  }),
};

const createCardInviteValidation = {
  body: Joi.object({
    cardId: Joi.string().required(),
    emails: Joi.array().items(Joi.string().email()).min(1).required(),
    role: Joi.string().required(),
  }),
};

const acceptCardInviteValidation = {
  params: Joi.object({
    key: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string(),
      googleToken: Joi.string(),
    })
    .xor("email", "googleToken"),
};

const deleteCardInviteValidation = {
  params: Joi.object({
    key: Joi.string().required(),
  }),
};

const listPendingCardInviteValidation = {
  params: Joi.object({
    cardId: Joi.string().required(),
  }),
};

const listCardMembersValidation = {
  params: Joi.object({
    cardId: Joi.string().required(),
  }),
};

const resendCardInviteValidation = {
  params: Joi.object({
    key: Joi.string().required(),
  }),
};

const getByCardIdValidation = {
  params: Joi.object({
    cardId: Joi.string().required(),
  }),
};

const adminLoginValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  createCardValidation,
  signValidation,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  PurchaseAddon,
  createCardCheckoutSession,
  createCardInviteValidation,
  acceptCardInviteValidation,
  deleteCardInviteValidation,
  listPendingCardInviteValidation,
  listCardMembersValidation,
  resendCardInviteValidation,
  getByCardIdValidation,
  adminLoginValidation,
};
