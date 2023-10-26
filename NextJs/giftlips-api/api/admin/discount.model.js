const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const DiscountSchema = new mongoose.Schema(
  {
    name: { type: String }, 
    discountCode: { type: String, require: true },
    discountAmount: { type: Number, require: true },
    discountType: { type: String, enum: ["Percentage", "Flat"], default: "percentage" },
    redemption: { type: Number },
    limits: { maxRedemption: { type: Number }},
    couponId: { type: String },
    promoId: { type: String },
    expireTime: { type: Date }
  },
  { timestamps: true }
);
DiscountSchema.plugin(mongoosePaginate);

const Discount = mongoose.model("Discount", DiscountSchema);
module.exports = Discount;
