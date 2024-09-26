import Product from "../database/models/product.model.js";

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find({});
    res.json({
      products,
    });
  } catch (error) {
    console.log(`[GET_ALL_PRODUCTS_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
