const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const moment = require("moment");
var { expressjwt } = require("express-jwt");
const { config } = require("./config/index");
const User = require("./api/users/user.model");
const Card = require("./api/cards/card.model");
const CardService = require("./api/cards/card.service");
const CardMemberService = require("./api/cardMembers/cardMember.service");
const CardInviteService = require("./api/cardInvites/cardInvite.service");

const checkJwt = expressjwt({
  secret: config.authSecret,
  algorithms: ["HS256"],
});

const checkInviteLimits = async (req, res, next) => {
  let { id } = req.params;
  const card = await Card.findById(id);
  if (card.usage.invites < card.limits.invites) {
    next();
  } else {
    res.status(400).json({
      detail: "Invite limit reached. Please upgrade your plan.",
      code: "LIMIT_EXCEEDED",
    });
  }
};

const checkExpiryLimits = async (req, res, next) => {
  let { id } = req.params;
  const card = await Card.findById(id);
  if (card.expiryAt && moment(card.expiryAt).isBefore(moment())) {
    next();
  } else {
    res.status(400).json({
      detail: "Card expired. Please upgrade your plan.",
      code: "CARD_EXPIRED",
    });
  }
};

const auth0CheckJwt = expressjwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://giftlips.us.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer
  audience: process.env.AUTH0_AUDIENCE, //replace with your API's audience, available at Dashboard > APIs
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

const cardMemberCheck = async (req, res, next) => {
  if (!req.auth) return res.sendStatus(401);

  req.user = await User.findById(req.auth.id);
  req.card = await CardService.findById(req.params.cardId || req.body.cardId);

  if (!req.card) return res.sendStatus(404);

  req.cardMember = await CardMemberService.findOne({
    cardId: req.card.id,
    userId: req.user.id,
  });

  if (req.user.id !== req.card.userId && !req.cardMember) {
    return res.sendStatus(403);
  }

  next();
};

const cardAdminCheck = async (req, res, next) => {
  if (!req.auth) return res.sendStatus(401);

  req.user = await User.findById(req.auth.id);
  req.card = await CardService.findById(req.params.cardId || req.body.cardId);

  if (!req.card) return res.sendStatus(404);

  req.cardInvite = await CardInviteService.findOne({
    cardId: req.card.id,
    email: req.user.email,
    role: "admin",
    accepted: true,
  });

  if (req.user.id !== req.card.userId && !req.cardInvite) {
    return res.sendStatus(403);
  }

  next();
};

const adminCheck = async (req, res, next) => {
  if (!req.auth) return res.sendStatus(401);

  req.user = await User.findById(req.auth.id);

  if (!req.user.isStaff) {
    return res.sendStatus(403);
  }

  next();
};

module.exports = {
  checkJwt,
  auth0CheckJwt,
  checkInviteLimits,
  checkExpiryLimits,
  cardMemberCheck,
  cardAdminCheck,
  adminCheck,
};
