var express = require("express");
const CardController = require("./card.controller");
var schema = require("../schema");
const { validate } = require("express-validation");
const { cardMemberCheck, cardAdminCheck } = require("../../middleware");
const { checkJwt } = require("../../middleware");
var router = express.Router();

router.get("/",checkJwt, CardController.list);
router.get("/invited",checkJwt, CardController.listInvited);
router.post(
  "/",
  CardController.create
);
router.get("/:cardId",  CardController.get);
router.get("/carddata/:cardId", checkJwt,  CardController.getcard);
router.put("/:cardId", cardMemberCheck,checkJwt, CardController.put);
router.post("/:cardId/claim",checkJwt, CardController.claimCard);
router.post("/:cardId/entry", cardMemberCheck, CardController.createEntry); //todo deprecate
router.delete("/:id/entry/:entryId",checkJwt, CardController.deleteEntry); //todo deprecate
router.post("/:id/assets",checkJwt, CardController.setAssets); //todo refactor: save design API
router.post("/:cardId/published", cardAdminCheck, CardController.setPublished); //todo deprecate
router.post("/:id/download",checkJwt,  CardController.download); //todo refactor: move to separate directory
router.delete("/:id", checkJwt, CardController.deleteItem);
router.post("/addEmptyCards", checkJwt, CardController.createEmptyCards);
router.put("/addUserToCard/:cardId", checkJwt, CardController.emptyCardDetails);
module.exports = router;
