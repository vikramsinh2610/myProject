const Order = require("../order/order.model");

const orderDetails = async (req, res) => {
  try {
    const { status } = req.params;
    const { page, limit } = req.query;

    const query = {
      orderStatus: status,
    };

    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      sort: { updatedAt: -1 },
      populate: "cardId",
    };
    const details = await Order.paginate(query, options);
    if (details) {
      return res.status(200).json({
        success: true,
        data: details,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No Data Found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
      success: false,
    });
  }
};

module.exports = {
  orderDetails,
};
