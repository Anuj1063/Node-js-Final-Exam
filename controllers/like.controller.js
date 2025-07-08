const likeModel = require("../models/like.model");

class LikeController {
  async likePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const existingLike = await likeModel.findOne({ postId, userId });

      if (existingLike) {
        await likeModel.findOneAndDelete({ postId, userId });
        return res.status(200).json({ message: "Like removed successfully." });
      } else {
        await likeModel.create({ postId, userId });
        return res.status(201).json({ message: "Post liked successfully." });
      }
    } catch (err) {
      console.error("Error liking post:", err.message);
      return res.status(500).json({ message: "Error liking the post" });
    }
  }
}

module.exports = new LikeController();
