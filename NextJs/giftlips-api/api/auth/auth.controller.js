const User = require("../users/user.model");
const Card = require("../cards/card.model");
const Token = require("../tokens/token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Joi } = require("express-validation");
const { config } = require("../../config/index");
const sendEmail = require("../../utils/sendEmail");

const check = async (req, res) => {
  res.json(req.auth);
};

const login = async (req, res) => {
  const { email, password, cardId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    if (cardId) {
      const card = await Card.findById(cardId);
      if (card.userId) {
        return res.status(400).send({ message: "Invalid card." });
      } else {
        card.userId = user._id;
        await card.save();
      }
    }
    let payload = {
      id: user.id,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isStaff: user.isStaff,
    };
    const token = jwt.sign(payload, config.authSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN, // 24 hours
    });
    return res.status(200).send({
      accessToken: token,
      user: payload,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Server error",
    });
  }
};

const validatePasswords = async (req, res, next) => {
  const { newPassword, newPassword2 } = req.body;
  if (newPassword !== newPassword2) {
    res.status(400).json({ detail: "Passwords do not match" });
  } else {
    next();
  }
};

const passwordChange = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  let user = await User.findById(req.auth.sub);
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) {
    res.status(400).json({ detail: "Old password does not match" });
  } else {
    user.password = await bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_SALT)
    );
    await user.save();
    res.json({ success: true });
  }
};

const resetPasswordConfirm = async (req, res) => {
  const { token, userId } = req.query;
  const { password, password2 } = req.body;
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    return res
      .status(400)
      .json({ detail: "Invalid or expired password reset token" });
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    return res
      .status(400)
      .json({ detail: "Invalid or expired password reset token" });
  }
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById(userId);
  await sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.firstName,
    },
    "../views/email/resetPassword.handlebars"
  );
  await passwordResetToken.deleteOne();
  return res.json({ success: true });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const token = await Token.findOne({ userId: user._id });

    if (token) {
      await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

    await Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.FRONTEND_URL}/password-reset?token=${resetToken}&userId=${user._id}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.firstName, link: link },
      "../views/email/requestResetPassword.handlebars"
    );

    res.json({ success: true, link: link });
  } else {
    res.json({ success: true });
  }
};

const getProfile = async (req, res) => {
  let user = await User.findById(req.auth.sub);
  res.json({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    smsCountryCode: user.smsCountryCode,
    countryCode: user.countryCode,
    profilePhoto: user.profilePhoto,
  });
};

const updateProfile = async (req, res) => {
  try {
    let user = await User.findById(req.auth.sub);
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || "";
    user.phone = req.body.phone || "";
    user.smsCountryCode = req.body.smsCountryCode || "";
    user.countryCode = req.body.countryCode || "";
    user.profilePhoto = req.body.profilePhoto || user.profilePhoto;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ detail: "Server Error" });
  }
};

const register = async (req, res) => {
  const { email, firstName, lastName, password, cardId, location } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).send({
        message: "Email already exists",
      });
    } else {
      if (cardId) {
        const card = await Card.findById(cardId);
        if (card.userId) {
          return res.status(400).send({ message: "Invalid card." });
        }
      }
      let user = await User.create({
        email,
        firstName,
        lastName,
        password: bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT)),
        location: location
      });
      if (cardId) {
        const card = await Card.findById(cardId);
        card.userId = user._id;
        await card.save();
      }
      let payload = {
        id: user.id,
        sub: user.id,
        email: email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = jwt.sign(payload, config.authSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN, // 24 hours
      });
      return res.status(200).send({
        accessToken: token,
        user: payload,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Server error",
    });
  }
};

const facebookAuth = async (req, res) => {
  const { email, pictureUrl, name } = req.body;
  try {
    const checkexists = await User.findOne({ email: email });
    if (checkexists) {
      let payload = {
        id: checkexists.id,
        sub: checkexists.id,
        firstName: checkexists.firstName,
        lastName: checkexists.lastName,
        email: checkexists.email,
        isStaff: checkexists?.isStaff,
      };
      const jwtToken = jwt.sign(payload, config.authSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN, // 24 hours
      });
      return res.status(200).send({
        accessToken: jwtToken,
        user: payload,
      });
    } else {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          profilePhoto: pictureUrl,
          firstName: name,
        },
        { upsert: true }
      );
      let payload = {
        id: user.id,
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isStaff: user.isStaff,
      };
      const jwtToken = jwt.sign(payload, config.authSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN, // 24 hours
      });
      return res.status(200).send({
        accessToken: jwtToken,
        user: payload,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, detail: "INVALID_TOKEN" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, isStaff: true });

    if (!user) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const payload = {
      id: user.id,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      isStaff: user.isStaff,
    };

    const token = jwt.sign(payload, config.authSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).send({
      accessToken: token,
      user: payload,
    });
  } catch (e) {
    console.log(e);

    res.status(500).send({ message: "Server error" });
  }
};

module.exports = {
  check,
  login,
  register,
  getProfile,
  updateProfile,
  resetPassword,
  resetPasswordConfirm,
  passwordChange,
  validatePasswords,
  facebookAuth,
  adminLogin,
};
