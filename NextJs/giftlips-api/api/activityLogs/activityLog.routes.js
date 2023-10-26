var express = require("express");
const Controller = require("./activityLog.controller");
var schema = require("../schema");
const { validate } = require("express-validation");
var router = express.Router();

router.get("/", Controller.listForCard);
router.post("/", Controller.createLog);

module.exports = router;
