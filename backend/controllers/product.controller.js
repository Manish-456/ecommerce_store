import redis from "../database/redis.js";
import Product from "../database/models/product.model.js";
import cloudinary from "../database/cloudinary.js";

export async function getAllProducts(_req, res) {
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

export async function getFeaturedProducts(_req, res) {
  try {
    // Check if featured products are already cached in Redis
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      // If cached, return the cached result
      return res.json(JSON.parse(featuredProducts));
    }

    // If not cached, fetch featured products from the database
    // `.lean()` method return a plain Javascript object instead of a Mongoose document.
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    // If no featured products are found, return a 404 error
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // Cache the featured products in Redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    // Return the featured products to the client
    res.json(featuredProducts);
  } catch (error) {
    // Log any errors that occur during the process
    console.log(`[GET_FEATURED_PRODUCTS_ERROR]: ${error.message}`);
    // Return a 500 error to the client with the error message
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, price, image, category } = req.body;

    // Variable to store the cloudinary response
    let cloudinaryResponse = null;

    // If an image is provided, upload it to Cloudinary
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    // Create a new Product instance with the provided details
    const newProduct = new Product({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : null,
      category,
    });

    // Save the new product to the database
    await newProduct.save();

    return res.status(201).json({
      product: newProduct,
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.log(`[PRODUCT_CREATION_ERROR]: ${error.message}`);
    // Return a 500 error to the client with the error message
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the product is a featured product
    const isFeatured = product.isFeatured;

    // Delete the product image from Cloudinary if it exists
    if (product.image) {
      const publicId = product.image.split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log(`Deleted image from cloudinary`);
      } catch (error) {
        console.log(`[ERROR_DELETING_IMAGE]`, error.message);
      }
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);

    // If the deleted product was a featured product, update the featured products cache
    if (isFeatured) {
      // Retrieve the cached featured products from Redis
      const cachedFeaturedProduct = await redis.get("featured_products");
      const featuredProduct = JSON.parse(cachedFeaturedProduct);
      // Filter out the deleted product from the cached featured products
      const updatedFeaturedProduct = featuredProduct.filter(
        (product) => product._id !== req.params.id
      );
      // Update the featured products cache in Redis
      await redis.set(
        "featured_products",
        JSON.stringify(updatedFeaturedProduct)
      );
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.log(`[PRODUCT_DELETION_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
