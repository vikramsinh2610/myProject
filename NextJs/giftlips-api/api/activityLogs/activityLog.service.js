const {
  CREATE,
  SCAN,
  LIKE_VIDEO,
  UNLIKE_VIDEO,
  COMMENT,
  UPLOAD,
  JOIN,
  DOWNLOAD,
  EXTEND,
  PURCHASE_VIDEO,
  PURCHASE_USER,
} = require("./constants");
const ActivityLog = require("./activityLog.model");

const logActivity = async (data) => {
  try {
    let { cardId, actorId, type, object } = data;
    let content = "";
    if (type === CREATE) {
      content = `{actor} created the card.`;
    } else if (type === SCAN) {
      content = `{actor} scanned the card.`;
    } else if (type === LIKE_VIDEO) {
      content = `{actor} liked the card.`;
    } else if (type === UNLIKE_VIDEO) {
      content = `{actor} unliked the card.`;
    } else if (type === COMMENT) {
      content = `{actor} commented on the card.`;
    } else if (type === UPLOAD) {
      content = `{actor} uploaded a video.`;
    } else if (type === JOIN) {
      content = `{actor} joined the card.`;
    } else if (type === DOWNLOAD) {
      content = `{actor} downloaded the card. `;
    } else if (type === EXTEND) {
      content = `{actor} extended the card's validity.`;
    } else if (type === PURCHASE_VIDEO) {
      content = `{actor} purchased video credits.`;
    } else if (type === PURCHASE_USER) {
      content = `{actor} purchased invite credits.`;
    }
    return await ActivityLog.create({
      card: cardId,
      actor: actorId,
      content,
      object,
      type,
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  logActivity,
};
