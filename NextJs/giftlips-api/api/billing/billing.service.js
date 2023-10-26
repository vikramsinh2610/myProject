const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const discountModel = require('../admin/discount.model')

console.log(process.env.STRIPE_PUBLISHABLE_KEY);
console.log(process.env.STRIPE_SECRET_KEY);

const getActiveSubscriptions = async (stripeCustomerId) => {
  const subscriptionStatus = "active";

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: subscriptionStatus,
    });
    return subscriptions.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const stripeRetrieveSubscriptionById = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const searchActiveSubscriptions = async (stripeCustomerId, cardId) => {
  try {
    const subscription = await stripe.subscriptions.search({
      query: `status:'active' AND metadata['card_id']:'${cardId}'`,
    });
    return subscription.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getActiveSubscription = async (stripeCustomerId) => {
  let subscriptions = await getActiveSubscriptions(stripeCustomerId);
  if (subscriptions.length) {
    return subscriptions[0];
  } else {
    return null;
  }
};

const stripeCancelSubscription = async (activeSubscription, cancel = true) => {
  let response = await stripe.subscriptions.update(activeSubscription.id, {
    cancel_at_period_end: cancel,
  });
  return response;
};

const getActiveCardSubscription = async (stripeCustomerId, cardId) => {
  let subscriptions = await searchActiveSubscriptions(stripeCustomerId, cardId);
  if (subscriptions.length) {
    return subscriptions[0];
  } else {
    return null;
  }
};

const checkHasActiveSubscription = async (stripeCustomerId) => {
  return (await getActiveSubscriptions(stripeCustomerId)).length;
};

const checkHasActiveCardSubscription = async (stripeCustomerId, cardId) => {
  let customerSubscriptions = await getActiveCardSubscription(
    stripeCustomerId,
    cardId
  );
  console.log(customerSubscriptions);
  return customerSubscriptions;
};

const previewCardInvoiceProration = async (
  activeSubscription,
  items,
  cardId
) => {
  const proration_date = Math.floor(Date.now() / 1000);
  let updateDataItems = items.map((item) => {
    let lineItem = activeSubscription.items.data.find(
      (lineItem) => lineItem.price.id === item.price
    );
    return { id: lineItem.id, quantity: item.quantity };
  });
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: activeSubscription.customer,
    subscription: activeSubscription.id,
    subscription_items: updateDataItems,
    subscription_proration_date: proration_date,
  });
  return invoice;
};

const previewInvoiceProration = async (activeSubscription, newPriceId) => {
  const proration_date = Math.floor(Date.now() / 1000);
  const items = [
    {
      id: activeSubscription.items.data[0].id,
      price: newPriceId, // Switch to new price
    },
  ];

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: activeSubscription.customer,
    subscription: activeSubscription.id,
    subscription_items: items,
    subscription_proration_date: proration_date,
  });
  return invoice;
};

const updateStripeSubscription = async (
  activeSubscription,
  newPriceId = null,
  items = null
) => {
  let updateData = {
    payment_behavior: "pending_if_incomplete",
    proration_behavior: "always_invoice",
  };
  if (items) {
    let updateDataItems = items.map((item) => {
      let lineItem = activeSubscription.items.data.find(
        (lineItem) => lineItem.price.id === item.price
      );
      return { id: lineItem.id, quantity: item.quantity };
    });
    updateData.items = updateDataItems;
  } else {
    updateData.items = [
      {
        id: activeSubscription.items.data[0].id,
        price: newPriceId,
      },
    ];
  }
  let updateResponse = await stripe.subscriptions.update(
    activeSubscription.id,
    updateData
  );
  return updateResponse;
};

const createPortalSession = async (customerId) => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.STRIPE_CANCEL_URL,
  });
  return portalSession;
};

const stripeCreateCheckoutSession = async (customerId) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: customerId,
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });
  return session;
};

const stripeCreateCardCheckoutSession = async (
  customerId,
  items,
  cardId,
  stripeSuccessUrl,
  stripeCancelUrl
) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: cardId,
    customer: customerId,
    line_items: items,
    subscription_data: {
      metadata: { card_id: cardId },
    },
    metadata: { card_id: cardId },
    success_url: stripeSuccessUrl || process.env.STRIPE_SUCCESS_URL,
    cancel_url: stripeCancelUrl,
  });
  return session;
};

const stripeCreateSingleCardCheckoutSession = async (
  customerId,
  items,
  purchaseRequestId,
  cardId,
  userId,
  stripeSuccessUrl,
  stripeCancelUrl, 
  promoId
) => {
  console.log("stripeCreateSingleCardCheckoutSession...");
  console.log({
    mode: "payment",
    client_reference_id: cardId,
    customer: customerId,
    line_items: items,
    discounts: [
      {promotion_code: promoId }
    ],
    payment_intent_data: {
      metadata: {
        card_id: cardId,
        purchase_request_id: purchaseRequestId,
        user_id: userId,
      },
    },
    metadata: {
      card_id: cardId,
      purchase_request_id: purchaseRequestId,
      user_id: userId,
    },
    success_url: stripeSuccessUrl,
    cancel_url: stripeCancelUrl,
  });
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: cardId,
    customer: customerId,
    line_items: items,
    discounts: [
      {promotion_code: promoId }
    ],
    payment_intent_data: {
      metadata: {
        card_id: cardId,
        purchase_request_id: purchaseRequestId,
        user_id: userId,
      },
    },
    metadata: {
      card_id: cardId,
      purchase_request_id: purchaseRequestId,
      user_id: userId,
    },
    success_url: stripeSuccessUrl,
    cancel_url: stripeCancelUrl,
  });
  
  return session;
};

const createStripeCustomerId = async (user) => {
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user._id,
    },
  });
  return customer.id;
};

const getPaymentMethod = async (paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  return paymentMethod;
};

module.exports = {
  getActiveSubscriptions,
  searchActiveSubscriptions,
  getActiveSubscription,
  getActiveCardSubscription,
  checkHasActiveSubscription,
  checkHasActiveCardSubscription,
  createStripeCustomerId,
  previewCardInvoiceProration,
  previewInvoiceProration,
  updateStripeSubscription,
  stripeCreateCheckoutSession,
  stripeCreateCardCheckoutSession,
  stripeCreateSingleCardCheckoutSession,
  stripeRetrieveSubscriptionById,
  createPortalSession,
  stripeCancelSubscription,
  getPaymentMethod,
};
