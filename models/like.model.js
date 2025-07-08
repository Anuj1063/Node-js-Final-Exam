const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey:false,
    timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
