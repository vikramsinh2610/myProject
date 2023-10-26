const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  CREATE,
  SCAN,
  LIKE_VIDEO,
  UNLIKE_VIDEO,
  COMMENT,
  UPLOAD,
  JOIN,
  DOWNLOAD,
  EXTEND,
  PURCHASE_USER,
  PURCHASE_VIDEO,
} = require("./constants");

const ActivityLogSchema = new mongoose.Schema(
  {
    card: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    object: Object,
    type: {
      type: String,
      enum: [
        CREATE,
        SCAN,
        LIKE_VIDEO,
        UNLIKE_VIDEO,
        COMMENT,
        UPLOAD,
        JOIN,
        DOWNLOAD,
        EXTEND,
        PURCHASE_USER,
        PURCHASE_VIDEO,
      ],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ActivityLogSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

ActivityLogSchema.plugin(mongoosePaginate);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
module.exports = ActivityLog;
