const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PurchaseRequestSchema = new mongoose.Schema(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    printShip: Number,
    years: Number,
    videos: Number,
    users: Number,
  },
  { timestamps: true }
);

const PurchaseRequest = mongoose.model(
  "PurchaseRequest",
  PurchaseRequestSchema
);
module.exports = PurchaseRequest;
