const CardInvite = require("../cardInvites/cardInvite.model");

const members = async (req, res) => {
  const { cardId } = req.params;

  try {
    const members = await CardInvite.find({ cardId, accepted: true });
    return res.json(members);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

module.exports = {
  members,
};
