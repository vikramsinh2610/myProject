const express = require("express");
const TemplateController = require("./template.controller");
const UserController = require("./user.controller");
const FontController = require("./font.controller");
const CardController = require("./card.controller");
const OrderController = require("./order.controller");
const DiscountController = require('./discount.controller')
const BillingController = require("../billing/billing.controller");
const router = express.Router();

router.get("/templates", TemplateController.list);
router.get("/getPopularTemplate", TemplateController.getPopularTemplate);
router.post("/templates", TemplateController.create);
router.put("/templates/:templateId", TemplateController.update);
router.delete("/templates/:templateId", TemplateController.remove);

router.get("/users", UserController.list);
router.get("/users/:userId/cards", UserController.cards);
router.post("/userStatistics", UserController.userStatistics);
router.put("/users/:userId", UserController.update);

router.get("/cards/:cardId/members", CardController.members);

router.get("/fonts", FontController.list);
router.get("/font-lib", FontController.getFontLib);
router.post("/fonts", FontController.create);
router.put("/fonts/delete", FontController.remove);

router.get("/orderDetails/:status", OrderController.orderDetails);

router.get("/discount", DiscountController.getAll)
router.post("/discount", DiscountController.createDiscountCoupon)
router.patch("/discount", DiscountController.editDiscountCoupon)
router.delete("/discount", DiscountController.deleteDiscountCoupon)
// router.get("/discount/details", DiscountController.detailsDiscountCoupon)

router.post("/create-stripe-coupon", BillingController.createStripeCoupon)

router.post("/create-promotion-code", BillingController.createPromotionCode)

router.get("/getProfile/:id", UserController.getProfile);
router.put("/updateProfile", UserController.updateProfile);
router.post("/changePassword", UserController.changePassword);

module.exports = router;
  