const commentModel = require("../models/comment.model");

class CommentController {
  async commentOnPost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({ message: "Comment text is required." });
      }

      await commentModel.create({ postId, userId, comment });

      return res.status(201).json({ message: "Comment added successfully." });
    } catch (err) {
      console.error("Error commenting on post:", err.message);
      return res.status(500).json({ message: "Error commenting on the post" });
    }
  }
}

module.exports = new CommentController();
