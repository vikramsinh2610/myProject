const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Stripe = require("./stripe.model");

const makePayment = async (req, res) => {
  try {
    const {
      stripeEmail,
      stripeName,
      stripeToken,
      price,
      description,
      currency,
      orderId,
    } = req.body;
    if (
      !stripeEmail &&
      !stripeName &&
      !stripeToken &&
      !price &&
      !description &&
      !currency &&
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details.",
      });
    }

    stripe.customers
      .create({
        email: stripeEmail,
        token: stripeToken,
        name: stripeName,
      })
      .then((customer) => {
        return stripe.charges.create({
          amount: price,
          description: description,
          currency: currency,
          customer: customer.id,
        });
      })
      .then((charge) => {
        Stripe.create({
          orderId: orderId,
          totalAmount: price,
          chargeId: charge.id,
          recieptUrl: charge.receipt_url,
        }).then((payment) => {
          return res.status(200).json({
            success: true,
            message: "Payment registered successfully.",
          });
        });
      })
      .catch((err) => {
        return (
          res.status(500),
          json({
            success: false,
            message: err,
          })
        );
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  makePayment,
};
