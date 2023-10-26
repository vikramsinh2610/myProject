var express = require("express");
const Controller = require("./like.controller");
var schema = require("./like.schema");
const { validate } = require("express-validation");
const { checkJwt } = require("../../middleware");
var router = express.Router();

router.post("/", checkJwt, validate(schema.postLike), Controller.postLike);

module.exports = router;
