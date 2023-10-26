const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = require("mongoose");

const StripeSchema = new mongoose.Schema({
  customerId: String, //MOST important - we only care about saving this
  subscriptionId: String,
  defaultPaymentMethodId: String,
  planName: String,
  latestInvoiceId: String,
  subscriptionStatus: String,
  priceId: String,
  productId: String,
});

const UserSchema = new mongoose.Schema(
  {
    profilePhoto: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    smsCountryCode: String,
    countryCode: String,
    newsletterOptIn: Boolean,
    notify: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        entryId: { type: Schema.Types.ObjectId, ref: "Entry" },
        cardId: { type: Schema.Types.ObjectId, ref: "Card" },
      },
    ],
    isStaff: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    googleId: String,
    googleToken: String,
    location: {
      countryCode: {
        type: String
      },
      countryName: {
        type: String
      },
      city: {
        type: String
      },
      postal: {
        type: String
      },
      latitude: {
        type: String
      },
      longtitude: {
        type: String
      },
      IPv4: {
        type: String
      },
      state: {
        type: String
      }
    },
    stripe: {
      type: StripeSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

UserSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
