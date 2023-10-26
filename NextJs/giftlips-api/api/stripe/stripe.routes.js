const express = require("express");
const {
  checkJwt,
} = require("../../middleware");
const StripeController = require("./stripe.controller");
var router = express.Router();

router.post("/payment", checkJwt, StripeController.makePayment);

module.exports = router;