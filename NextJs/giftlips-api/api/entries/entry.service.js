const Card = require("../cards/card.model");
const CardMember = require("../cardMembers/cardMember.model");

const userCanUploadEntry = (membership) => {
  return membership && membership?.usage?.videos < membership?.limits?.videos;
};

module.exports = {
  userCanUploadEntry,
};
