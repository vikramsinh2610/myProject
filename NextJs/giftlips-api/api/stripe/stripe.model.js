const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const StripeSchema = new mongoose.Schema(
    {
      orderId: { type: Schema.Types.ObjectId, ref: "Order" },
      totalAmount: { type: Schema.Types.Number },
      chargeId: { type: Schema.Types.String },
      recieptUrl: { type: Schema.Types.String }
    },
    { timestamps: true }
  );
  StripeSchema.plugin(mongoosePaginate);
  
  const Order = mongoose.model("Stripe", StripeSchema);
  module.exports = Order;
  