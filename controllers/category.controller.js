const categoryModel = require("../models/category.model");

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          status: false,
          message: "Name is Required",
        });
      }
      const isNameExist = await categoryModel.findOne({ name });

      if (isNameExist) {
        return res.status(400).json({
          status: false,
          message: "Name Already Exist",
        });
      }

      const category = await categoryModel.create({ name });
      if (category) {
        return res.status(201).json({
          status: false,
          message: "Category Created Successfully",
          category,
        });
      }
    } catch (e) {
      console.log("Server Error", e);
    }
  }

  async categoryList(req, res) {
    try {
      const category = await categoryModel.aggregate([
        {
          $match: { isDeleted: false },
        },
        {
          $lookup: {
            from: "products",
            let: { categoryId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$isDeleted", false] },
                      { $eq: ["$categoryId", "$$categoryId"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  name: 1,
                  price: 1,
                  stocks: 1,
                },
              },
            ],

            as: "productDetails",
          },
        },
        {
          $project: {
            categoryName: "$name",
            totalProduct: {
              $size: "$productDetails",
            },
            productData: "$productDetails",
          },
        },
      ]);

      if (category) {
        return res.status(200).json({
          category,
        });
      }
    } catch (error) {
      console.log("Something Went Worng", error);
    }
  }
}

module.exports = new CategoryController();
