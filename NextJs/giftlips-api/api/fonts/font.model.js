const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const FontSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
  },
  { timestamps: true }
);

FontSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Font", FontSchema);
