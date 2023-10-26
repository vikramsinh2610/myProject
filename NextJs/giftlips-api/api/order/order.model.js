const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    name: { type: Schema.Types.String },
    url: { type: Schema.Types.String },
    addressLine: { type: Schema.Types.String },
    city: { type: Schema.Types.String },
    zip: { type: Schema.Types.Number },
    country: { type: Schema.Types.String },
    price: { type: Schema.Types.Mixed },
    jobId: { type: Schema.Types.Number },
    campaignId: { type: Schema.Types.String },
    orderStatus: {
      type: Schema.Types.String,
      enum: ["IN PROGRESS", "ORDERED", "CANCLE"],
    },
  },
  { timestamps: true }
);
OrderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
