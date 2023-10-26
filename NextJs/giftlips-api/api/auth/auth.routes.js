var express = require("express");
const AuthController = require("./auth.controller");
const OAuth2Controller = require("./oauth2.controller");
var schema = require("../schema");
const { validate } = require("express-validation");
const { checkJwt } = require("../../middleware");
var router = express.Router();

router.get("/test", checkJwt, AuthController.check);
router.post(
  "/login",
  validate(schema.loginValidation, { keyByField: true }, {}),
  AuthController.login
);
router.post(
  "/register",
  validate(schema.registerValidation, { keyByField: true }, {}),
  AuthController.register
);
router.get("/profile", checkJwt, AuthController.getProfile);
router.post(
  "/profile",
  checkJwt,
  validate(schema.updateProfileValidation, { keyByField: true }, {}),
  AuthController.updateProfile
);
router.post("/reset-password", AuthController.resetPassword);
router.post("/reset-password-confirm", AuthController.resetPasswordConfirm);
router.post(
  "/password-change",
  checkJwt,
  AuthController.validatePasswords,
  AuthController.passwordChange
);
router.post("/google", OAuth2Controller.googleAuth);
router.post("/facebook", AuthController.facebookAuth);
router.post(
  "/admin/login",
  validate(schema.adminLoginValidation, { keyByField: true }, {}),
  AuthController.adminLogin
);

module.exports = router;
