const categoryModel = require("../models/category.model");

class CategoryController {
  async addCategory(req, res) {
    try {
     

      const { name, description } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ message: "Please provide a category name." });
      }
      if (!description) {
        return res
          .status(400)
          .json({ message: "Please provide a category description." });
      }
      const isCategoryExist=await categoryModel.findOne({name})
      if(isCategoryExist){
        return res.status(400).json({
          message:"Category Already exits"
        })
      }

      await categoryModel.create({ name, description });

      return res.status(201).json({
        message: "Category created successfully.",
        data: { name, description },
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong." });
    }
  }

  async listCategoriesWithPosts(req, res) {
    try {
      const categories = await categoryModel.aggregate([
        {
          $lookup: {
            from: "posts",
            let: { catId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$categoryId", "$$catId"] },
                },
              },
              {
                $project: {
                  title: 1,
                  content: 1,
                  tags: 1,
                  userId: 1,
                },
              },
            ],
            as: "posts",
          },
        },
        {
          $project: {
            name: 1,
            posts: 1,
            totalPosts: { $size: "$posts" },
          },
        },
      ]);

      // Returning response with success message and fetched data
      return res.status(200).json({
        message: "Categories fetched successfully.",
        data: categories,
      });
    } catch (error) {
      // Logging and returning error if something goes wrong
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
}

module.exports = new CategoryController();
