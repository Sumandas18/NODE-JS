const Category = require("../models/category");
const Product = require("../models/product");

class LookupController {
  async CreateCategory(req, res) {
    try {
      const data = await Category.create(req.body);
      return res.status(200).json({
        message: "Category created successfully",
        data: data,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async getCategory(req, res) {
    try {
      const data = await Category.find();
      return res.status(200).json({
        message: "Category get successfully",
        data: data,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async CreateProduct(req, res) {
    try {
      const { productName, categoryId, productPrice, productSize } = req.body;
      const data = new Product({
        productName,
        categoryId,
        productPrice,
        productSize,
      });
      await data.save();
      return res.status(200).json({
        message: "Product created successfully",
        data: data,
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async CreateProductwithCategory(req, res) {
    try {

        const lookupQuery=[
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
       
        // {
        //   $project: {
        //     productName: 1,
        //     "category.categoryName": 1,
        //   },
        // },
        // {
        //     $unwind:"$category"
        // }
        //group category
        {
          $group: {
            _id: "$category.categoryName",
            products: {
              $push: {
                ProductName: "$productName",
                ProductPrice: "$productPrice",
                ProductSize: "$productSize",
              },
            },
            total: {
              $sum: 1,
            },
          },
        },
        
      ]

      
      const productData = await Product.aggregate(lookupQuery);

      return res.status(200).json({
        message: "Product created successfully",
        data: productData,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new LookupController();