const CardInviteService = require("./cardInvite.service");
const CardService = require("../cards/card.service");
const CardMemberService = require("../cardMembers/cardMember.service");
const User = require("../users/user.model");
const crypto = require("crypto");
const { sendEmails } = require("../../utils/sendEmail");
const mongoose = require("mongoose");
const moment = require("moment");
const CardInvite = require("./cardInvite.model");
const Card = require("../cards/card.model");
const CardMember = require("../cardMembers/cardMember.model");

const sendInvite = async (req, res) => {
  try {
    const { cardId, email } = req.body;
    const userId = req.auth.id;
    if (!cardId && !email) {
      return res.status(400).json({
        sucess: false,
        message: "Please enter required data.",
      });
    }

    // user can not enter owner of card email
    if (email === req.auth.email) {
      return res.status(400).json({
        success: false,
        message: `Please remove owner email address ${email}`,
      });
    }

    // get user details
    const userDetail = await User.findById(userId);

    // Only one time user can send link to the other user
    const isAlreadySentInvite = await CardInvite.find({
      $and: [{ cardId: cardId }, { email: email }],
    });

    if (isAlreadySentInvite?.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invitation sent only once to user of one card.",
      });
    }

    // check limit of invite of card
    const cardDetails = await Card.findById(cardId);
    if (cardDetails.usage.invites >= cardDetails.limits.invites) {
      return res.status(400).json({
        success: false,
        message: "No card invites left.",
      });
    }
    const key = crypto.randomBytes(32).toString("hex");
    const inviteLink = `${process.env.FRONTEND_URL}/card-invites/${key}/acceptInvite`;

    const saveCardInvitesDetails = await CardInvite.create({
      cardId: cardId,
      email: email,
      key: key,
      inviteLink: inviteLink,
      inviter: userId,
    });
    if (saveCardInvitesDetails) {
      const cardDetails = await Card.findByIdAndUpdate(
        cardId,
        {
          $inc: { "usage.invites": 1 },
        },
        { upsert: true }
      );
      await sendEmails(
        email,
        "Giftlips Card Invitation.",
        {
          inviterFirstName: userDetail.firstName,
          inviterEmail: req.auth.email,
          giftlipsUrl: "https://giftlips.com",
          inviteLink: inviteLink,
        },
        "../views/email/cardInvite.handlebars"
      );
      return res.status(200).json({
        success: true,
        cardInvite: saveCardInvitesDetails,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const key = req.params.key;
    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Please enter required data.",
      });
    }

    //check that available in db or not
    const cardInviteDetails = await CardInvite.findOne({
      $and: [{ key: key }, { email: req.auth.email }],
    });
    if (cardInviteDetails && cardInviteDetails?.accepted === false) {
      // Add user as card member
      const cardMemberDetails = await CardMember.create({
        cardId: cardInviteDetails.cardId,
        userId: req.auth.id,
      });

      if (cardMemberDetails) {
        await CardInvite.findOneAndUpdate(
          { key: key },
          { $set: { accepted: true } }
        );
        await Card.findByIdAndUpdate(
          cardInviteDetails.cardId,
          {
            $push: { members: cardMemberDetails._id },
          },
          { upsert: true, new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Joined to the card.",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: "Not Authorized user.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const removeInvite = async (req, res) => {
  try {
    const key = req.params.key;
    const userId = req.auth.id;
    const email = req.auth.email;

    if (!key && !userId && !email) {
      return res.status(400).json({
        success: false,
        message: "Please enter required data.",
      });
    }
    const isInviteAvailable = await CardInvite.findOne({
      $and: [{ key: key }, { inviter: userId }, { accepted: false }],
    });

    if (!isInviteAvailable) {
      return res.status(400).json({
        success: false,
        message: "Invite is not available",
      });
    }

    await isInviteAvailable.remove();

    return res.status(200).json({
      success: true,
      message: "Invite is successfully removed.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getGeneratedCardLink = async (req, res) => {
  try {
    const { id } = req.auth;
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({
        success: false,
        message: "No card found",
      });
    }
    const pendingList = await CardInvite.findOne({
      $and: [
        { cardId: mongoose.Types.ObjectId(cardId) },
        { inviter: mongoose.Types.ObjectId(id) },
      ],
    }).sort({
      _id: -1,
    });
      return res.status(200).json({
        data: pendingList,
      });
   
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getPendingList = async (req, res) => {
  try {
    const { id, email } = req.auth;
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details.",
      });
    }
    const pendingList = await CardInvite.find({
      $and: [
        { cardId: mongoose.Types.ObjectId(cardId) },
        { accepted: false },
        { inviter: id },
      ],
    });
    if (pendingList.length > 0) {
      return res.status(200).json({
        success: false,
        data: pendingList,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getAcceptedList = async (req, res) => {
  try {
    const { id, email } = req.auth;
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details.",
      });
    }
    const acceptedList = await CardInvite.find({
      $and: [
        { cardId: mongoose.Types.ObjectId(cardId) },
        { accepted: true },
        { inviter: id },
      ],
    });
    if (acceptedList.length > 0) {
      return res.status(200).json({
        success: false,
        data: acceptedList,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const sendOthers = async (req, res) => {
  try {
    const { cardId, name } = req.body;
    const userId = req.auth.id;
    if (!cardId && !name) {
      return res.status(400).json({
        sucess: false,
        message: "Please enter required data.",
      });
    }
    // get user details
    const userDetail = await User.findById(userId);
    // check limit of invite of card
    const cardDetails = await Card.findById(cardId);

    const key = crypto.randomBytes(32).toString("hex");
    const inviteLink = `${process.env.FRONTEND_URL}/card-invites/${key}/inviteothers`;

    const saveCardInvitesDetails = await CardInvite.create({
      cardId: cardId,
      name: name,
      key: key,
      inviteLink: inviteLink,
      inviter: userId,
    });
    if (saveCardInvitesDetails) {
      const cardDetails = await Card.findByIdAndUpdate(
        cardId,
        {
          $inc: { "usage.invites": 1 },
        },
        { upsert: true }
      );
      return res.status(200).json({
        success: true,
        cardInvite: saveCardInvitesDetails,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getCardDetails = async (req, res) => {
  console.log("inside");
  const { key } = req.params;
  if (!key) {
    return res.status(400).json({
      success: false,
      message: "Please enter required details.",
    });
  }

  try {
    const card = await CardInvite.findOne({ key }).populate("cardId");
    return res.status(200).json({ status: true, message: card });
  } catch (error) {
    return res.status(500).json({ status: false, message: error });
  }
};

module.exports = {
  sendInvite,
  sendOthers,
  acceptInvite,
  getGeneratedCardLink,
  removeInvite,
  getPendingList,
  getAcceptedList,
  getCardDetails,
};
