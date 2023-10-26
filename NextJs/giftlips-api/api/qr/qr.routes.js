var express = require("express");
const QRController = require("./qr.controller");
var router = express.Router();

router.get("/test", QRController.test);

module.exports = router;
