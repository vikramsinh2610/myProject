const User = require("../users/user.model");

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { config } = require("../../config/index");

const googleAuth = async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const { sub, given_name, family_name, email, picture } =
      ticket.getPayload();

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
          googleId: sub,
          googleToken: token,
          firstName: given_name,
          lastName: family_name,
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

module.exports = {
  googleAuth,
};
