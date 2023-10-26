var express = require("express");
const BillingController = require("./billing.controller");
const { checkJwt, cardAdminCheck } = require("../../middleware");
const { validate } = require("express-validation");
const schema = require("../schema");
var router = express.Router();

router.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  BillingController.webhook
);
router.get("/", checkJwt, BillingController.getBilling);
router.get("/sync-info", checkJwt, BillingController.info);
router.post(
  "/checkout-session",
  checkJwt,
  cardAdminCheck,
  BillingController.createCheckoutSession
);
router.post(
  "/card-checkout-session",
  checkJwt,
  validate(schema.createCardCheckoutSession, { keyByField: true }, {}),
  cardAdminCheck,
  BillingController.createCardCheckoutSession
);
router.get("/plans", BillingController.getPlans);
router.post(
  "/purchase",
  checkJwt,
  validate(schema.PurchaseAddon, { keyByField: true }, {}),
  BillingController.purchase
);
router.post(
  "/card-single-checkout-session",
  checkJwt,
  validate(schema.createCardCheckoutSession, { keyByField: true }, {}),
  cardAdminCheck,
  BillingController.createCardSingleCheckoutSession
);
router.post(
  "/update-subscription",
  checkJwt,
  BillingController.updateSubscription
);
router.post(
  "/cancel-card-subscription",
  checkJwt,
  BillingController.cancelCardSubscription
);
router.post(
  "/update-card-subscription",
  checkJwt,
  BillingController.updateCardSubscription
);
router.post(
  "/update-subscription-preview",
  checkJwt,
  BillingController.previewSubscriptionUpdate
);
router.post(
  "/update-card-subscription-preview",
  checkJwt,
  BillingController.previewCardSubscriptionUpdate
);
router.post(
  "/customer-portal",
  checkJwt,
  BillingController.createCustomerPortal
);

module.exports = router;
