const { logActivity } = require("../activityLogs/activityLog.service");
const Entry = require("../entries/entry.model");
const Like = require("./like.model");
const { LIKE_VIDEO } = require("../activityLogs/constants");

const postLike = async (req, res) => {
  const auth = req.auth;
  const { entryId } = req.body;
  const entry = await Entry.findById(entryId);

  try {
    await Like.findOneAndUpdate(
      { entry: entryId, card: entry.cardId, user: auth.sub },
      {},
      { new: true, upsert: true }
    );

    await logActivity({
      cardId: entry.cardId,
      actorId: auth.sub,
      type: LIKE_VIDEO,
      entry,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }

  res.json("OK");
};

module.exports = {
  postLike,
};
