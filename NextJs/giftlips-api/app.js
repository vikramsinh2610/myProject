const dotenv = require("dotenv");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const qr = require("./api/qr/qr.routes");
const auth = require("./api/auth/auth.routes");
const cards = require("./api/cards/card.routes");
const entries = require("./api/entries/entry.routes");
const cardInvites = require("./api/cardInvites/cardInvite.routes");
const cardMembers = require("./api/cardMembers/cardMember.routes");
const templates = require("./api/templates/template.routes");
const publicRoutes = require("./api/public/public.routes");
const adminRoutes = require("./api/admin/admin.routes");
const billingRoutes = require("./api/billing/billing.routes");
const users = require("./api/users/user.routes");
const blog = require("./api/blog/blog.routes");
const activities = require("./api/activityLogs/activityLog.routes");
const likes = require("./api/likes/like.routes");
const order = require("./api/order/order.routes");
const stripe = require("./api/stripe/stripe.routes");
const { ValidationError } = require("express-validation");

dotenv.config();
var app = express();

// socket
var { io } = require("./io");
app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose.connect(process.env.DATABASE_URL);
const { checkJwt, adminCheck } = require("./middleware");
const { runImport } = require("./scripts/templateLib");
const sendEmail = require("./utils/sendEmail");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// adding Helmet to enhance your API's security
app.use(helmet());

// Enable CORS
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// Enable the use of request body parsing middleware
app.use((req, res, next) => {
  if (req.originalUrl === "/billing/webhooks") {
    next();
  } else {
    bodyParser.json();
    bodyParser.urlencoded({
      extended: true,
    });
    express.json()(req, res, next);
  }
});

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/billing", billingRoutes);
app.use("/entries", entries);
app.use("/auth", auth);
app.use("/cards", cards);
app.use("/card-invites", cardInvites);
app.use("/card-members", cardMembers);
app.use("/templates", templates);
app.use("/public", publicRoutes);
app.use("/admin", checkJwt, adminCheck, adminRoutes); //todo check for role
app.use("/users", users);
app.use("/qr", qr);
app.use("/blog", blog);
app.use("/activities", activities);
app.use("/likes", likes);
app.use("/order", order);
app.use("/stripe", stripe);

app.get("/health-check", (req, res) => res.sendStatus(200));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// runImport();

// sendEmail(
//   "apparas1994@gmail.com",
//   "Welcome to Giftlips",
//   { name: "Arnold Paras" },
//   "../views/email/welcome.handlebars"
// );

// sendEmail(
//   "apparas1994@gmail.com",
//   "Password Reset Request",
//   { link: "some@link.com" },
//   "../views/email/requestResetPassword.handlebars"
// );

// sendEmail(
//   "apparas1994@gmail.com",
//   "Password Changed Successfully",
//   {},
//   "../views/email/resetPassword.handlebars"
// );

// sendEmail(
//   "apparas1994@gmail.com",
//   "Card Invitation",
//   {
//     inviterFirstName: "Arnold",
//     inviterEmail: "apparas1994@gmail.com",
//     inviteLink: "some@link.com",
//   },
//   "../views/email/cardInvite.handlebars"
// );

module.exports = app;
