const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const LikeSchema = new mongoose.Schema(
  {
    entry: { type: Schema.Types.ObjectId, ref: "Entry", required: true },
    card: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
LikeSchema.plugin(mongoosePaginate);

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
