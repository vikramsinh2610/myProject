const User = require("../users/user.model");
const Card = require("../cards/card.model");
const Discount = require("../admin/discount.model");
const BillingService = require("./billing.service");
const CardService = require("../cards/card.service");
const { stripeRetrieveSubscriptionById } = require("./billing.service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { config } = require("../../config/index");
const moment = require("moment/moment");
const PaymentLog = require("../paymentLogs/paymentLog.model");
const PurchaseRequest = require("../purchaseRequest/purchaseRequest.model");
const CardMember = require("../cardMembers/cardMember.model");
const Order = require("../order/order.model");
const discountModel = require('../admin/discount.model')
const { sendEmails } = require("../../utils/sendEmail");

const {
  postCardAuth,
  placeOrderToMyPostcard,
} = require("../order/order.controller.js");

const info = async (request, response) => {
  const auth = request.auth;
  const user = await User.findById(auth.sub);

  if (user.stripe.customerId) {
    const subscriptions = await BillingService.getActiveSubscriptions(
      user.stripe.customerId
    );

    if (subscriptions.length) {
      let activeSubscription = subscriptions[0];

      user.stripe.defaultPaymentMethodId =
        activeSubscription.default_payment_method;
      user.stripe.subscriptionId = activeSubscription.id;
      user.stripe.latestInvoiceId = activeSubscription.latest_invoice;
      user.stripe.subscriptionStatus = activeSubscription.status;
      user.stripe.priceId = activeSubscription.items.data[0].price.id;
      user.stripe.productId = activeSubscription.items.data[0].price.product;
      await user.save();

      response.json(user.stripe);
    } else {
      response.status(400).json({ detail: "No active subscription" });
    }
  } else {
    response
      .status(400)
      .json({ detail: "User has no related stripe customer id" });
  }
};

const getBilling = async (req, res) => {
  const auth = req.auth;
  const user = await User.findById(auth.sub);

  if (user.stripe.customerId) {
    const subscriptions = await BillingService.getActiveSubscriptions(
      user.stripe.customerId
    );

    const data = await Promise.all(
      subscriptions.map(async (subscription) => {
        const card = await CardService.findById(subscription.metadata.card_id);
        subscription.metadata.card = card;
        const paymentMethod = await BillingService.getPaymentMethod(
          subscription.default_payment_method
        );
        subscription.metadata.paymentMethod = paymentMethod;
        return subscription;
      })
    );

    res.json(data);
  } else {
    res.status(400).json({ detail: "User has no related stripe customer id" });
  }
};

const createCustomerPortal = async (request, response) => {
  try {
    const auth = request.auth;
    const user = await User.findById(auth.sub);
    const customerId = user.stripe.customerId;
    const portalSession = await BillingService.createPortalSession(customerId);
    response.json(portalSession);
  } catch (e) {
    response.status(400).json({ detail: e });
  }
};

const previewCardSubscriptionUpdate = async (request, response) => {
  try {
    let { items, cardId } = request.body;
    const auth = request.auth;
    const user = await User.findById(auth.sub);
    let subscription = await BillingService.getActiveCardSubscription(
      user.stripe.customerId,
      cardId
    );
    if (subscription) {
      const invoice = await BillingService.previewCardInvoiceProration(
        subscription,
        items,
        cardId
      );
      response.json(invoice);
    } else {
      response.status(400).json({
        detail:
          "User has no active card subscription. Create a checkout session",
      });
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const previewSubscriptionUpdate = async (request, response) => {
  try {
    let { priceId } = request.body;
    if (!priceId) {
      priceId = process.env.PREMIUM_YEARLY;
    }
    const auth = request.auth;
    const user = await User.findById(auth.sub);
    let subscription = await BillingService.getActiveSubscription(
      user.stripe.customerId
    );
    if (subscription) {
      const invoice = await BillingService.previewInvoiceProration(
        subscription,
        priceId
      );
      response.json(invoice);
    } else {
      response.status(400).json({
        detail: "User has no active subscription. Create a checkout session",
      });
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const cancelCardSubscription = async (req, res) => {
  try {
    let { cardId, cancel } = req.body;
    const auth = req.auth;
    const user = await User.findById(auth.sub);
    let cardSubscription = await BillingService.getActiveCardSubscription(
      user.stripe.customerId,
      cardId
    );
    if (cardSubscription) {
      let updateResponse = await BillingService.stripeCancelSubscription(
        cardSubscription,
        cancel
      );
      res.json(updateResponse);
    } else {
      res.status(400).json({
        detail:
          "User has no active subscription for card. Create a checkout session",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const updateCardSubscription = async (req, res) => {
  try {
    let { items, cardId } = req.body;
    const auth = req.auth;
    const user = await User.findById(auth.sub);
    let cardSubscription = await BillingService.getActiveCardSubscription(
      user.stripe.customerId,
      cardId
    );
    console.log(cardSubscription);
    if (cardSubscription) {
      let updateResponse = await BillingService.updateStripeSubscription(
        cardSubscription,
        null,
        items
      );
      res.json(updateResponse);
    } else {
      res.status(400).json({
        detail:
          "User has no active subscription for card. Create a checkout session",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const updateSubscription = async (req, res) => {
  try {
    let { priceId } = req.body;
    if (!priceId) {
      priceId = process.env.PREMIUM_YEARLY;
    }
    const auth = req.auth;
    const user = await User.findById(auth.sub);
    let subscription = await BillingService.getActiveSubscription(
      user.stripe.customerId
    );
    if (subscription) {
      if (subscription.items.data[0].price.id === priceId) {
        res.status(400).json({
          detail:
            "Invalid priceId. User cannot upgrade/downgrade to same plan.",
        });
      } else {
        let updateResponse = await BillingService.updateStripeSubscription(
          subscription,
          priceId
        );
        res.json(updateResponse);
      }
    } else {
      res.status(400).json({
        detail: "User has no active subscription. Create a checkout session",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const createCardSingleCheckoutSession = async (request, response) => {
  try {
    let { items, cardId, stripeSuccessUrl, stripeCancelUrl } = request.body;

    const auth = request.auth;
    const user = await User.findById(auth.sub);

    if (!user.stripe) {
      user.stripe = {};
      await user.save();
    }

    let customerId = user.stripe.customerId;
    if (!customerId) {
      customerId = await BillingService.createStripeCustomerId(user);
      user.stripe.customerId = customerId;
      await user.save();
    }
    console.log(customerId);

    const session = await BillingService.stripeCreateSingleCardCheckoutSession(
      customerId,
      items,
      cardId,
      stripeSuccessUrl,
      stripeCancelUrl
    );
    response.json(session);
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const pricingMatrix = {
  development: {
    printShip: {
      priceId: "price_1MsmpmK55Pm2a0gIhUxvZb3B",
      unitPrice: 7.99,
    },
    years: {
      priceId: "price_1MMorNK55Pm2a0gIuypIvBJ3",
      unitPrice: 5,
    },
    users: {
      priceId: "price_1M248HK55Pm2a0gIxhnfgxb2",
      unitPrice: 1,
    },
    videos: {
      priceId: "price_1M248aK55Pm2a0gIYqBgzeve",
      unitPrice: 1,
    },
  },
  production: {
    printShip: {
      priceId: "price_1Msh8YK55Pm2a0gIA2vVKMkH",
      unitPrice: 7.99,
    },
    years: {
      priceId: "price_1MMorNK55Pm2a0gIuypIvBJ3",
      unitPrice: 5,
    },
    users: {
      priceId: "price_1M248HK55Pm2a0gIxhnfgxb2",
      unitPrice: 1,
    },
    videos: {
      priceId: "price_1M248aK55Pm2a0gIYqBgzeve",
      unitPrice: 1,
    },
  },
};

const getPlans = async (request, response) => {
  let env = process.env.NODE_ENV || "development";
  response.json(pricingMatrix[env]);
};

const purchase = async (request, response) => {
  let env = process.env.NODE_ENV || "development";

  try {
    let { cardId, printShip, years, videos, users, promoId } = request.body;
    const auth = request.auth;
    const user = await User.findById(auth.sub);
    console.log(`user: ${user}`);

    if (!user.stripe) {
      user.stripe = {};
      await user.save();
    }

    let customerId = user.stripe.customerId;
    if (!customerId) {
      customerId = await BillingService.createStripeCustomerId(user);
      user.stripe.customerId = customerId;
      await user.save();
    }
    console.log(`customerId: ${customerId}`);

    let items = [];
    if (printShip > 0) {
      items.push({
        price: pricingMatrix[env].printShip.priceId,
        quantity: printShip,
      });
    }
    if (years > 0) {
      items.push({
        price: pricingMatrix[env].years.priceId,
        quantity: years,
      });
    }

    if (videos > 0) {
      items.push({
        price: pricingMatrix[env].videos.priceId,
        quantity: videos,
      });
    }

    if (users > 0) {
      items.push({
        price: pricingMatrix[env].users.priceId,
        quantity: users,
      });
    }

    const purchaseRequest = await PurchaseRequest.create({
      userId: auth.sub,
      cardId,
      printShip,
      years,
      videos,
      users,
    });

    console.log(`purchaseRequest: ${purchaseRequest}`);

    let stripeSuccessUrl = `${process.env.FRONTEND_URL}/dashboard?payment_success=1`;
    let stripeCancelUrl = `${process.env.FRONTEND_URL}/cards/${cardId}/customize?payment_failed=1`;
    const session = await BillingService.stripeCreateSingleCardCheckoutSession(
      customerId,
      items,
      purchaseRequest._id.toString(),
      cardId,
      auth.sub,
      stripeSuccessUrl,
      stripeCancelUrl,
      promoId
    );
    response.json(session);
  } catch (e) {
    console.log(e);
    response.status(500).json(e.message);
  }
};

const createCardCheckoutSession = async (request, response) => {
  try {
    let { items, cardId, stripeSuccessUrl, stripeCancelUrl } = request.body;

    const auth = request.auth;
    const user = await User.findById(auth.sub);

    if (!user.stripe) {
      user.stripe = {};
      await user.save();
    }

    let customerId = user.stripe.customerId;
    if (!customerId) {
      customerId = await BillingService.createStripeCustomerId(user);
      user.stripe.customerId = customerId;
      await user.save();
    }
    console.log(customerId);

    let hasActiveSubscription =
      await BillingService.checkHasActiveCardSubscription(
        user.stripe.customerId,
        cardId
      );
    console.log(hasActiveSubscription);
    if (!hasActiveSubscription) {
      const session = await BillingService.stripeCreateCardCheckoutSession(
        customerId,
        items,
        cardId,
        stripeSuccessUrl,
        stripeCancelUrl
      );
      response.json(session);
    } else {
      response
        .status(400)
        .json({ detail: "Card already has an active subscription." });
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const createCheckoutSession = async (request, response) => {
  try {
    let { priceId } = request.body;
    if (!priceId) {
      priceId = process.env.PRO_MONTHLY;
    }
    const auth = request.auth;
    const user = await User.findById(auth.sub);

    if (!user.stripe) {
      user.stripe = {};
      await user.save();
    }

    let customerId = user.stripe.customerId;
    if (!customerId) {
      customerId = await BillingService.createStripeCustomerId(user);
      user.stripe.customerId = customerId;
      await user.save();
    }
    console.log(customerId);

    let hasActiveSubscription = await BillingService.checkHasActiveSubscription(
      user.stripe.customerId
    );
    if (!hasActiveSubscription) {
      const session = await BillingService.stripeCreateCheckoutSession(
        customerId,
        priceId
      );
      response.json(session);
    } else {
      response
        .status(400)
        .json({ detail: "User already has an active subscription." });
    }
  } catch (e) {
    response.status(400).json(e);
  }
};

const onSubscribeSuccess = async (session, evtId, evtType) => {
  let cardId = session.metadata.card_id;
  let subscriptionId = session.subscription;
  try {
    let subscription = await stripeRetrieveSubscriptionById(subscriptionId);
    let inviteSubscriptionItem = subscription.items.data.find(
      (lineItem) => lineItem.price.id === process.env.PER_ORGANIZER_PRICE_ID
    );
    let cardObject = await Card.findById(cardId);
    cardObject.stripe.subscriptionId = subscriptionId;
    cardObject.stripe.subscriptionStatus = subscription.status;
    cardObject.limits.invites =
      config.features.invites + inviteSubscriptionItem.quantity;
    await cardObject.save();
  } catch (e) {
    console.log(e);
    return null;
  }
};

const onPaymentSuccess = async (session, evtId, evtType) => {
  let cardId = session.metadata.card_id;
  let purchaseRequestId = session.metadata.purchase_request_id;
  let userId = session.metadata.user_id;
  let userData 
  
  try {
    const user = await User.findById(userId);
    userData = user
  } catch (e) {
    console.log(e);
  }
  //Log
  await PaymentLog.create({
    cardId: cardId,
    userId: userId,
    eventId: evtId,
    eventType: evtType,
    eventData: JSON.stringify(session),
  });

  let purchaseRequestObject = await PurchaseRequest.findById(purchaseRequestId);

  //Increase card limits (years + users)
  let cardObject = await Card.findById(cardId);
  cardObject.expiryAt = moment(cardObject.expiryAt).add(
    purchaseRequestObject.years,
    "year"
  );
  cardObject.limits.invites += purchaseRequestObject.users;
  await cardObject.save();

  //Increase membership limits
  let cardMemberObject = await CardMember.findOne({
    cardId: cardId,
    userId: userId,
  });
  cardMemberObject.limits.videos += purchaseRequestObject.videos;
  await cardMemberObject.save();
  const orderDetails = await Order.findOne({ cardId: cardId }).sort({
    _id: -1,
  });
  let orderId = orderDetails._id;
  const convertedPrice = session?.amount_total/100
  const orderData = await Order.findByIdAndUpdate(orderId, { $set: { price: convertedPrice}}, {upsert: true, new: true});
  const callAuth = await postCardAuth();
  if (callAuth?.success) {
    const token = callAuth.data;
    await placeOrderToMyPostcard(token, orderId);
    await sendEmails(
      userData.email,
      "Giftlips Order Details.",
      {
        inviterFirstName: userData.firstName,
        giftlipsUrl: "https://giftlips.com",
        ordername : orderData.name,
        orderaddress: orderData.addressLine,
        ordercity: orderData.city,
        orderzip: orderData.zip,
        orderprice: orderData.price,
      },
      "../views/email/paymentSuccess.handlebars"
    );
  }
};

const webhook = async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  let signature = req.headers["stripe-signature"];

  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  let data = event.data;
  let eventType = event.type;

  switch (eventType) {
    case "checkout.session.completed":
      console.log("checkout.session.completed");
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      const session = data.object;
      if (session.mode === "subscription") {
        await onSubscribeSuccess(session, event.id, eventType);
      } else if (session.mode === "payment") {
        await onPaymentSuccess(session, event.id, eventType);
      }
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    case "promotion_code.updated":
      const sessionData = data.object;
      if (sessionData?.id) {
        await discountModel.findOneAndUpdate(
          { promoId: sessionData?.id },
          { $inc: { redemption: 1 } },
          { upsert: true }
        );
      }
      break;
    default:
      console.log(`Unhandled event type ${eventType}`);
  }

  res.sendStatus(200);
};

const createStripeCoupon = async (req, res) => {
  try {
    const { discountId, discountAmount, discountType, name, maxRedemption } = req.body;
    if (!discountAmount && !discountType && !name && !discountId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details."
      });
    }
    let coupon;
    if (discountType === "Percentage") {
      coupon = await stripe.coupons.create({
        name: name,
        percent_off: discountAmount,
        max_redemptions: maxRedemption
      });
    } else if (discountType === "Flat") {
      let amount = parseInt(discountAmount * 100);
      coupon = await stripe.coupons.create({
        name: name,
        amount_off: amount,
        currency: "usd",
        max_redemptions: maxRedemption
      });
    }
    if (coupon) {
      await Discount.findByIdAndUpdate(discountId, { $set: { couponId: coupon.id } }, { upsert: true });
      return res.status(200).json({
        success: true,
        data: coupon
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong"
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const createPromotionCode = async (req, res) => {
  try {
    const { couponId, discountCode, discountId, maxRedemption } = req.body;
    if (!couponId && !discountCode && !discountId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details."
      });
    }

    const promotionCode = await stripe.promotionCodes.create({
      coupon: couponId,
      code: discountCode,
      max_redemptions: maxRedemption
    });

    if (promotionCode) {
      await Discount.findByIdAndUpdate(discountId, { $set: { promoId: promotionCode.id } }, { upsert: true })
      return res.status(200).json({
        success: true,
        data: promotionCode
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong"
      })
    }

  } catch (error) {
    return res.status(500).status(500).json({
      success: false,
      message: error.message
    });
  }
}



module.exports = {
  info,
  webhook,
  getPlans,
  purchase,
  createCardSingleCheckoutSession,
  createCardCheckoutSession,
  createCheckoutSession,
  createCustomerPortal,
  updateSubscription,
  updateCardSubscription,
  cancelCardSubscription,
  previewSubscriptionUpdate,
  previewCardSubscriptionUpdate,
  getBilling,
  createStripeCoupon,
  createPromotionCode
};
