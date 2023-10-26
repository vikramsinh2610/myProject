const express = require("express");
const CardInviteController = require("./cardInvite.controller");
const schema = require("../schema");
const { checkJwt } = require("../../middleware");
const { validate } = require("express-validation");
const router = express.Router();

router.post("/", checkJwt, CardInviteController.sendInvite);

router.post("/inviteOthers", checkJwt, CardInviteController.sendOthers);

router.post("/:key/acceptInvite", checkJwt, CardInviteController.acceptInvite);

router.delete("/:key", checkJwt, CardInviteController.removeInvite);

router.get("/:cardId/pending", checkJwt, CardInviteController.getPendingList);

router.get("/:cardId/invitedcardlink", checkJwt, CardInviteController.getGeneratedCardLink);

router.get("/:cardId", checkJwt, CardInviteController.getAcceptedList);

router.get("/:key/getCardDetails", CardInviteController.getCardDetails);

module.exports = router;