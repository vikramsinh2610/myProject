const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { config } = require("../../config/index");
const moment = require("moment/moment");

//metadata we save but not important at the moment
const StripeSchema = new mongoose.Schema({
  subscriptionId: String,
  subscriptionStatus: String,
  paymentIntent: String,
  paymentStatus: String,
});

const CardSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    shortId: String,
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    isDeleted: { type: Boolean, default: false },
    template: { type: Schema.Types.ObjectId, ref: "Template" },
    //
    assets: [
      {
        url: String,
      },
    ],
    variables: [
      {
        type: { type: String, enum: ["text", "image", "QR"] },
        label: String,
        elementId: String,
        value: String,
        width: Number,
        height: Number,
        x: Number,
        y: Number,
      },
    ],
    coverUrl: String,
    stripe: {
      type: StripeSchema,
      default: () => ({}),
    },
    expiryAt: { type: Date, default: moment().add(21, "days") },
    usage: {
      invites: { type: Number, default: 0 },
    },
    limits: {
      invites: { type: Number, default: config.features.invites },
    },
    message: String,
    qrImage: String,
    members: [{ type: Schema.Types.ObjectId, ref: "CardMember" }],
    entries: [{ type: Schema.Types.ObjectId, ref: "Entry" }],
  },
  { timestamps: true }
);

CardSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
CardSchema.plugin(mongoosePaginate);

const Card = mongoose.model("Card", CardSchema);
module.exports = Card;
