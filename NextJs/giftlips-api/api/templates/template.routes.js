var express = require("express");
const TemplateController = require("./template.controller");
const { checkJwt, adminCheck } = require("../../middleware");
var router = express.Router();

router.get("/", TemplateController.list);
router.get("/all", TemplateController.getAll);
router.get("/:id", TemplateController.get);
router.get("/slug/:slug", TemplateController.getBySlug);
router.post("/", checkJwt, TemplateController.create);
router.put(
  "/setPositions",
  checkJwt,
  adminCheck,
  TemplateController.setPositions
);

module.exports = router;
