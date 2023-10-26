const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CardInviteSchema = new mongoose.Schema(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card"},
    email: { type: Schema.Types.String },
    name: { type: Schema.Types.String },
    key: { type: Schema.Types.String },
    inviteLink: { type: Schema.Types.String },
    inviter: { type: Schema.Types.ObjectId, ref: "User" },
    accepted: { type: Schema.Types.Boolean, default: false },
    isDeleted: { type: Schema.Types.Boolean, default: false },
  },
  { timestamps: true }
);

CardInviteSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

CardInviteSchema.plugin(mongoosePaginate);

const CardInvite = mongoose.model("CardInvite", CardInviteSchema);
module.exports = CardInvite;
