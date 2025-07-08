const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
   comment: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model("Comment", commentSchema);
