const CardMember = require("./cardMember.model");
const CardService = require("../cards/card.service");
const CardInvite = require("../cardInvites/cardInvite.model");
const { default: mongoose } = require("mongoose");

const getByCardId = async (req, res) => {
  try {
    const { id } = req.auth;
    const { cardId } = req.params;
    console.log(id, cardId);

    const cardMember = await CardMember.findOne({ cardId, userId: id });

    return res.json(cardMember);
  } catch (e) {
    return res.status(500).json({ detail: "ERROR" });
  }
};

const list = async (req, res) => {
  try {
    const { id, email } = req.auth;
    const { cardId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const card = await CardService.findById(cardId);
    const cardInvite = await CardInvite.exists({
      cardId,
      email,
      accepted: true,
    });

    if (card.userId !== id && !cardInvite) return res.sendStatus(403);

    const paginated = await CardMember.paginate({ cardId }, { limit, offset });

    res.json(paginated);
  } catch (e) {
    res.status(500).json({ detail: "ERROR" });
  }
};

const personalDetailOfMember = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details.",
      });
    }

    const memberPersonalDetails = await CardMember.find({
      cardId: cardId,
    }).populate("userId");

    const memberCardInvite = await CardInvite.find({
      cardId: memberPersonalDetails.map((item) => {
        return item.cardId;
      }),
    });

    // console.log("memberCardInvite...", memberPersonalDetails);
    if (memberCardInvite) {
      return res.status(200).json({
        success: true,
        data: memberCardInvite,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No data found.",
      });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = { list, getByCardId, personalDetailOfMember };
