const ActivityLog = require("./activityLog.model");
const { logActivity } = require("./activityLog.service");
const { CREATE } = require("./constants");

const createLog = async (req, res) => {
  const { actorId, type } = req.body;
  let log = await logActivity({
    cardId,
    actorId,
    type,
  });
  res.json(log);
};

const listForCard = async (req, res) => {
  const { cardId } = req.query;
  let query = { card: cardId };
  let options = { limit: 10, page: 1, populate: "actor" };
  let activities = await ActivityLog.paginate(query, options);
  res.json(activities);
};

module.exports = {
  listForCard,
  createLog,
};
