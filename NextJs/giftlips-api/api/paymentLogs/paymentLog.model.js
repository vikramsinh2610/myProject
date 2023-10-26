const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PaymentLogSchema = new mongoose.Schema(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    eventId: String,
    eventType: String,
    eventData: String,
  },
  { timestamps: true }
);

const PaymentLog = mongoose.model("PaymentLog", PaymentLogSchema);
module.exports = PaymentLog;
