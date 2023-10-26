var express = require("express");
const { validate } = require("express-validation");
const {
  checkJwt,
} = require("../../middleware");
const OrderController = require("./order.controller");
var router = express.Router();

router.post("/",checkJwt, OrderController.createOrder);

router.post("/orderCard", checkJwt, OrderController.orderCard);

router.get("/postCardAuth", checkJwt, OrderController.postCardAuth);

router.post("/postCardPlaceOrder", checkJwt, OrderController.placeOrderToMyPostcard)

router.get(
  '/orderDetailsByUser',
  checkJwt,
  OrderController.orderDetailsByUser,
);

router.put("/updateOrder", checkJwt, OrderController.updateOrder);

module.exports = router;