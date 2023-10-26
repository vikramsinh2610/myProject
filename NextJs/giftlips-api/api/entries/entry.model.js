const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const EntrySchema = new mongoose.Schema(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    url: String,
    thumbnailUrl: String,
    metadata: {
      fileType: String,
      name: String,
      size: Number,
      videoHeight: Number,
      videoWidth: Number,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },
    cardMember: { type: Schema.Types.ObjectId, ref: "CardMember" },
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },  
        message: {
          type: Schema.Types.String
        },
      }
    ]
  },
  { timestamps: true }
);

EntrySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

const Entry = mongoose.model("Entry", EntrySchema);
module.exports = Entry;
