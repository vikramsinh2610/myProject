const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { config } = require("../../config/index");

const QRSchema = new mongoose.Schema({
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
    gradientEnabled: Boolean,
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
    gradientEnabled: Boolean,
    color1: String,
    color2: String,
    text: String,
    font: String,
    gradientDirection: {
      type: String,
      enum: ["linear", "upDown", "diagonal1", "diagonal2", "radial"],
    },
  },
});

const TemplateSchema = new mongoose.Schema(
  {
    userId: String,
    slug: String,
    title: String,
    description: String,
    keywords: String,
    attributes: [String],
    categories: [String],
    tags: [String],
    orientation: String,
    coverUrl: String,
    assets: [
      {
        url: String,
      },
    ],
    width: { type: Number, default: config.card.defaultWidth },
    height: { type: Number, default: config.card.defaultHeight },
    popular: { type: Number },
    qr: {
      type: QRSchema,
      default: () => ({}),
    },
    position: Number,
    isEnabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TemplateSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

TemplateSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Template", TemplateSchema);
