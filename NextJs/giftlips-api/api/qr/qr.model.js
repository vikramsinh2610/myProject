const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

//todo plan is to only save QR properties but FE should be the one to draw
//and create QR image - for artqr and better performance
const QRSchema = new mongoose.Schema(
  {
    url: String,
    imageUrl: String,
    userId: String,
    coreAttributes: {
      backgroundColor: String,
      transparentBackground: Boolean,
      logo: String,
    },
    patternAttributes: {
      pattern: {
        type: String,
        enum: [
          "pattern0",
          "pattern1",
          "pattern2",
          "pattern3",
          "pattern4",
          "pattern5",
          "pattern6",
          "pattern7",
          "pattern8",
          "pattern9",
          "pattern10",
          "pattern13",
        ],
      },
      gradient: Boolean,
      colorDark: String,
      color1: String,
      color2: String,
      gradientDirection: {
        type: String,
        enum: ["linear", "upDown", "diagonal1", "diagonal2", "radial"],
      },
    },
    eyeAttributes: {
      eyeOuter: String,
      eyeInner: String,
      customEyeColor: Boolean,
      color1: String,
      color2: String,
    },
    frameAttributes: {
      frame: Number,
      gradient: Boolean,
      color1: String,
      color2: String,
      text: String,
      font: String,
      gradientDirection: {
        type: String,
        enum: ["linear", "upDown", "diagonal1", "diagonal2", "radial"],
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

QRSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

QRSchema.plugin(mongoosePaginate);

const QR = mongoose.model("QR", QRSchema);
module.exports = QR;
