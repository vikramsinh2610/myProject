var express = require("express");
const PublicController = require("./public.controller");
var router = express.Router();
var schema = require("../schema");
const { validate } = require("express-validation");
const CardController = require("../cards/card.controller");
const TemplateController = require("../templates/template.controller");
const { cardMemberCheck } = require("../../middleware");

router.post("/download", PublicController.download);

router.get("/templates", TemplateController.list);
router.get('/templates/all', TemplateController.getAll);
router.get("/templates/:id", TemplateController.get);

router.post("/cards", CardController.create);
router.post("/cards/:id/assets", CardController.setAssets);
router.post("/cards/:cardId/entry", CardController.createEntry); //todo deprecate
router.get("/cards/:cardId", CardController.get);
router.put("/cards/:cardId", CardController.put);
router.post("/cards/:shortId/entry", CardController.createPublicEntry);

router.post("/s3/sign", validate(schema.signValidation), PublicController.sign);
router.post("/generate-short-id", PublicController.generateShortId);

module.exports = router;
