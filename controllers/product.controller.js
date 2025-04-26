const productModel = require("../models/product.model");

const transporter=require("../config/email.config")

class ProductController {
  async createProduct(req, res) {
    try {
      const { name, price, stocks, categoryId } = req.body;

      if (!name || !price || !stocks || !categoryId) {
        return res.status(400).json({
          status: false,
          message: "All feilds Required",
        });
      }
      const isNameExist = await productModel.findOne({ name });

      if (isNameExist) {
        return res.status(400).json({
          status: false,
          message: " Product Name Already Exist",
        });
      }

      const product = await productModel.create({
        name,
        price,
        stocks,
        categoryId,
      });
      if (product) {
        return res.status(201).json({
          status: false,
          message: "Product Created Successfully",
          product,
        });
      }
    } catch (error) {
      console.log("Something went Worng", error);
    }
  }

  async productList(req, res) {
    try {
      let products = await productModel.find({ isDeleted: false })
        .select("-createdAt -updatedAt -isDeleted -categoryId");
  
      
  
      if (!products.length) {
        return res.status(404).json({
          status: false,
          message: "No products found",
        });
      }
  
      // Create Table
      let tableRows = products.map(product => `
        <tr>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.stocks}</td>
        </tr>
      `).join("");
  
      let htmlContent = `
        <p>Dear ${req.user.name},</p>
        <p>Here is the list of available products:</p>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p>Thanks for visiting us!</p>
      `;
  
      // Send Mail
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: req.user.email,
        subject: "All Products List",
        html: htmlContent
      });
  
      // After sending mail, send API response
      return res.status(200).json({
        status: true,
        message: "All products fetched and email sent successfully!",
        totalProduct: products.length,
        products,
      });
  
    } catch (err) {
      console.error("Something went wrong", err);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
  
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, stocks, price } = req.body;

      const existingProduct = await productModel.findOne({ _id: id });

      if (!existingProduct) {
        return res.status(400).json({
          status: false,
          message: "Product not Found",
        });
      }
      let updatedProduct = {
        name,
        price,
        stocks,
      };

      const updateProduct = await productModel.updateOne(
        { _id: id },
        updatedProduct
      );
      if (updateProduct) {
        return res.status(200).json({
          status: true,
          mesage: "Updated Successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct(req, res) {
    const product=await productModel.findOne({_id:req.params.id})
    if(product.isDeleted){
        return res.status(400).json({
            message:"product Not Found"
        })
    }
    const deleteProduct=await productModel.updateOne({_id:req.params.id},{isDeleted:true})
    
    if(deleteProduct){
        return res.status(200).json({
            status:false,
            message:"Deleted Successfully"
        })
    }
  }

  async lessStocks(req, res) {
    try {
      const products = await productModel.aggregate([
        {
            $match:{
                $expr:{
                    $and:[
                        {$eq:["$isDeleted",false]},
                        {$lt:["$stocks",100]}
                    ]
                }
            }
        },
        {
            $lookup:{
                from:"categories",
                let:{
                    c_id:"$categoryId"
                },
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $and:[
                                    {$eq:["$isDeleted",false]},
                                    {$eq:["$_id","$$c_id"]},
                                ]
                            }
                        }
                    },{
                        $project:{
                            name:1,
                            _id:0
                        }
                    }
                    
                ],
                as:"categoryDetails"
            }
        },
        {
            $unwind:"$categoryDetails"
        },
        {
            $project:{
                "categoryName":"$categoryDetails.name",
                "productName":"$name",
                "productPrice":"$price",
                "stocks":"$stocks",
                
            }
        }
    

      ])  
      console.log(products, "Less Stock");
  
      return res.status(200).json({
        success: true,
        message: "Products with less than 100 stocks fetched successfully",
        products,
      });
    } catch (error) {
      console.log("Server Error", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  
  


  
}

module.exports = new ProductController();
