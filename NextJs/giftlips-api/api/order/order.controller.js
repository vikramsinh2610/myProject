var qs = require("qs");
var axios = require("axios");
var FormData = require("form-data");
var fs = require("fs");
const Order = require("./order.model");
const sharp = require("sharp");
const Card = require("../cards/card.model");
const country = require("country-state-city");
const discountModel = require('../admin/discount.model')
const path = require("path");

const createOrder = async (req, res) => {
  try {
    const { userId, cardId, name, addressLine, city, zip, country } = req.body;
    if (
      !userId &&
      !cardId &&
      !name &&
      !addressLine &&
      !city &&
      !zip &&
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details",
      });
    }

    const checkOwerOfCard = await Card.find({
      $and: [{ _id: cardId }, { userId: userId }],
    });

    if (checkOwerOfCard && checkOwerOfCard.length > 0) {
      const url = checkOwerOfCard.map((e) => e.assets[0]?.url).toString();
      const createOrder = await Order.create({
        userId: userId,
        cardId: cardId,
        name: name,
        url: url || "",
        addressLine: addressLine,
        city: city,
        zip: zip,
        country: country,
        price: 7.99,
        orderStatus: "IN PROGRESS",
      });
      return res.status(200).json({
        success: true,
        data: createOrder,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Your not owner of card",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const orderCard = async (req, res) => {
  try {
    const {orderId, promoId, price} = req.body;
    const callAuth = await postCardAuth();
    if (callAuth?.success) {
      const token = callAuth.data;
      const callPlace = await placeOrderToMyPostcard(token, orderId);
      if (callPlace?.success) {
        if (promoId) {
          await discountModel.findOneAndUpdate(
            { promoId: promoId },
            { $inc: { redemption: 1 } },
            { upsert: true }
          );
        }
        await Order.findByIdAndUpdate(orderId, { $set: { price: price}});
        return res.status(200).json({
          success: true,
          data: callPlace.data
        })
      } else {
        return res.status(400).json({
          success: false,
          message: callPlace.message
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: callAuth.message
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

const postCardAuth = async () => {
  try {
    const data = qs.stringify({
      api_key: "26716b9f625aba27f6b566c",
      username: "qrtiger",
      password: "u8032@fu0z3!4fdfcaeZ",
    });
    const config = {
      method: "post",
      url: "https://www.mypostcard.com/api/v1/auth",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    const authdata = axios(config)
      .then(function (response) {
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(function (error) {
        return {
          success: false,
          message: error,
        };
      });
      return authdata;
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

const placeOrderToMyPostcard = async (token, orderId) => {
  try {
    const orderDetails = await Order.findById(orderId);
    const countryDetails = country.Country.getAllCountries(
      orderDetails.country
    );
    const countryIso = countryDetails.filter(
      (e) => e.name.toLowerCase() === orderDetails.country.toLowerCase()
    )[0]?.isoCode;

    if (!token && !orderId) {
      return {
        success: false,
        message: "Please enter required details",
      };
    }
    const response = await axios.get(`${orderDetails.url}`, {
      responseType: "arraybuffer",
    });
    const filePath = path.resolve(__dirname, `../../public/picture/out.png`);
    const widthData = await sharp(response.data).metadata();
    let convertedSvg;

    if (widthData?.width > 2000) {
      convertedSvg = await sharp(response.data)
        .rotate(90)
        .resize({ width: 1240, height: 1748 })
        .toFile(filePath)
    } else {
      convertedSvg = await sharp(response.data)
        .resize({ width: 1240, height: 1748 })
        .toFile(filePath)
    }
    
    try {
      if (convertedSvg) {
        const campaignId = "79";
        var data = new FormData();
        data.append("api_key", "26716b9f625aba27f6b566c");
        data.append("auth_token", token.auth_token);
        data.append("product_code", "J9GCU");
        data.append("image_type", "png");
        data.append('job_data', `{\n\t"recipients": [{\n\t\t"recipientName": "${orderDetails.name}",\n\t\t"addressLine1": "${orderDetails.addressLine}",\n\t\t"city": "${orderDetails.city}",\n\t\t"zip": "${orderDetails.zip}",\n\t\t"country": "${orderDetails.country}",\n\t\t"countryiso": "${countryIso}"\n\t}]\n}`);
        data.append("photo", fs.createReadStream("public/picture/out.png"));
        data.append("campaign_id", `${campaignId}`);

        var config = {
          method: "post",
          url: "https://www.mypostcard.com/api/v1/place_order",
          headers: data.getHeaders(),
          data: data,
        };
        const orderData = axios(config)
          .then(async (response) => {
            fs.unlinkSync(filePath);
            await Order.findByIdAndUpdate(
              orderId,
              { $set: { jobId: response.data?.job_id, orderStatus: "ORDERED", campaignId: campaignId } },
              { upsert: true }
            );
            return {
              success: true,
              data: response.data,
            };
          })
          .catch(async (error) => {
            return {
              success: false,
              message: error,
            };
          });
        return orderData;
      }  
    } catch (e) {
      console.log("e ", e);
      return {
        success: false,
        message:e
      }
    }
    
  } catch (error) {
   return {
      success: false,
      message: error,
    };
  }
};

const OrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details",
      });
    }
    const orderDetails = await Order.findById(orderId);

    if (orderDetails) {
      return res.status(200).json({
        success: true,
        data: orderDetails,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Didn't find Order Details",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const orderDetailsByUser = async (req, res) => {
  try {
    const userId = req.auth.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please enter required details.',
      });
    }

    const orderDetails = await Order.findOne({ userId: userId }).sort({
      _id: -1,
    });
    if (orderDetails) {
      return res.status(200).json({
        success: true,
        data: orderDetails,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Didn't find Order Details",
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required data.",
      });
    }
    const updateOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      upsert: true, new: true
    });
    if (updateOrder) {
      return res.status(200).json({
        success: true,
        message: "Your order is updated.",
        data: updateOrder
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Your order is not updated.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  createOrder,
  orderCard,
  postCardAuth,
  placeOrderToMyPostcard,
  OrderDetails,
  updateOrder,
  orderDetailsByUser,
};
