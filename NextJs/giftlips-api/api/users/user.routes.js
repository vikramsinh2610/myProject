var express = require("express");
const UserController = require("./user.controller");
const { detailsDiscountCoupon } = require("../admin/discount.controller");
var router = express.Router();

router.get("/:userId", UserController.get);

router.get("/discount/details" , detailsDiscountCoupon)

module.exports = router;
