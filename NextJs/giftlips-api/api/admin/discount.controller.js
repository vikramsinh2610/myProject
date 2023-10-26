const DiscountModel = require("./discount.model")
const moment = require('moment')

const getAll = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      sort: { updatedAt: -1 }
    }

    let allCoupons = await DiscountModel.paginate({}, options);
    if (allCoupons) {
      return res.status(200).json({
        success: true,
        allCoupons
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "No Data Found."
      });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e })
  }
}

const createDiscountCoupon = async (req, res) => {
  try {
    const { discountCode } = req.body

    let checkIfCreated = await DiscountModel.findOne({ discountCode })

    if (checkIfCreated) {
      return res.status(403).json({
        message: "This discount code has already been created"
      })
    }

    let createdDiscount = await DiscountModel.create(req.body)

    return res.status(200).json({
      message: "Discount code created successfully",
      data: createdDiscount
    })

  } catch (e) {
    return res.status(500).json({ success: false, message: e })
  }
}

const editDiscountCoupon = async (req, res) => {
  try {
    const { _id, discountCode, discountType, discountAmount, expireTime } = req.body
    let updatedDiscountCode = await DiscountModel.findOneAndUpdate({ _id }, { discountCode, discountAmount, discountType, expireTime }, { new: true })

    return res.status(200).json({
      message: "Discount code updated successfully",
      data: updatedDiscountCode
    })
  } catch (e) {
    return res.status(500).json({ success: false, message: e })
  }
}

const deleteDiscountCoupon = async (req, res) => {
  try {
    const { _id } = req.query
    let deletedId = await DiscountModel.deleteOne({ _id })

    return res.status(200).json({
      message: "Discount code deleted successfully",
      data: deletedId
    })
  } catch (e) {
    return res.status(500).json({ success: false, message: e })
  }
}

const detailsDiscountCoupon = async (req, res) => {
  try {
    const { discountCode } = req.query
    let isValid = await DiscountModel.findOne({ discountCode })
    if (!isValid) return res.status(200).json({ success: false, message: "Discount code is not valid" })

    if (isValid) {
      var expireDate = moment(isValid.expireTime, 'DD-MM-YYYY');
      var currDate = moment();
      const diff = expireDate.diff(currDate, 'days')
      if (diff < 0) {
        return res.status(203).json({
          success: false,
          message: "Discount code has already been expired"
        })
      }
    }

    if (isValid.redemption >= isValid.limits.maxRedemption) {
      return res.status(200).json({
        success: false,
        message: "Coupon limit is reached."

      })
    }

    if (discountCode === isValid.discountCode) {
      return res.status(200).json({
        success: true,
        message: "Discount code valid",
        data: isValid
      })
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect discount code, retry"
      })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}


module.exports = {
  getAll,
  createDiscountCoupon,
  editDiscountCoupon,
  deleteDiscountCoupon,
  detailsDiscountCoupon
}