const postModel = require("../models/post.model");


class PostController {
  async addPosts(req, res) {
    try {
      const { title, content, tags, userId, categoryId } = req.body;

      // Optional: Validate required fields
      if (!title || !content || !tags  || !categoryId) {
        return res.status(400).json({ message: "All fields are required." });
      }
      
      // Create the post
      const newPost = await postModel.create({
        userId :req.user._id,
        categoryId,
        title,
        content,
        tags,
      });

      return res.status(201).json({
        message: "Post created successfully",
        data: newPost,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Error creating post" });
    }
  }

  async listPosts(req, res) {
    try {
      const posts = await postModel.aggregate([
        {
          $match: { isDeleted: false },
        },

        // Lookup user
        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              { $project: { id: 1, email: 1 ,firstName:1,lastName:1} },
            ],
            as: "user",
          },
        },
        { $unwind: "$user" },

    
        {
          $lookup: {
            from: "categories",
            let: { catId: "$categoryId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$catId"] } } },
              { $project: { name: 1, _id: 0 } },
            ],
            as: "category",
          },
        },

        { $unwind: "$category" },


        {
          $lookup: {
            from: "likes",
            let: { postId: "$_id" },
            pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }],
            as: "likes",
          },
        },

        // Lookup comments with actual fields
        {
          $lookup: {
            from: "comments",
            let: { postId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
              {
                $project: {
                  _id: 0,
                  userId: 1,
                  comment: 1,
                },
              },
            ],
            as: "comments",
          },
        },

        // // Final shape
        {
          $project: {
            title: 1,
            content: 1,
            tags: 1,

            user: 1,
            category: 1,
            totalLikes: { $size: "$likes" },
            comments: 1, 
          },
        },
     
        {
          $sort: { totalLikes: -1 },
        },
      ]);

      return res.status(200).json({
        message: "Posts fetched successfully",
        count:posts.length,
        data: posts,
      });
    } catch (err) {
      console.error("Error listing posts:", err.message);
      return res.status(500).json({ message: "Error fetching posts" });
    }
  }

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const post = await postModel.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res
        .status(200)
        .json({ message: "Post updated successfully", data: post });
    } catch (err) {
      console.error("Error updating post:", err.message); // Better error logging
      res
        .status(400)
        .json({ message: "Something went wrong while updating the post" });
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params;

      const post = await postModel.findByIdAndDelete(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error("Error deleting post:", err.message);
      return res
        .status(400)
        .json({ message: "Something went wrong while deleting the post" });
    }
  }


}

module.exports = new PostController();
