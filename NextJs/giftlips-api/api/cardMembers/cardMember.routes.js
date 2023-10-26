var express = require("express");
const CardMemberController = require("./cardMember.controller");
var schema = require("../schema");
const { checkJwt } = require("../../middleware");
const { validate } = require("express-validation");
var router = express.Router();

router.get(
  "/:cardId/get-by-card-id",
  [validate(schema.getByCardIdValidation), checkJwt],
  CardMemberController.getByCardId
);

router.get(
  "/:cardId",
  [validate(schema.listCardMembersValidation),  checkJwt],
  CardMemberController.list
);

router.get(
  "/:cardId/personalDetailOfMember",
  checkJwt,
  CardMemberController.personalDetailOfMember
);

module.exports = router;
