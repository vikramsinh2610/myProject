const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CardMemberSchema = new mongoose.Schema(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    usage: {
      videos: { type: Number, default: 0 },
    },
    limits: {
      videos: { type: Number, default: 1 },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CardMemberSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

CardMemberSchema.plugin(mongoosePaginate);

const CardMember = mongoose.model("CardMember", CardMemberSchema);
module.exports = CardMember;
