import Product from "../database/models/product.model.js";

export async function getCartProducts(req, res) {
  try {
    const user = req.user;
    // Populate the cart items with the corresponding product details
    const products = await Product.find({
      _id: {
        $in: user.cartItem.map((item) => item.product),
      },
    });

    // Add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItem.find(
        (item) => item.product.toString() === product._id.toString()
      );

      return { ...product.toJSON(), quantity: item.quantity };
    });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.log(`[GET_CART_PRODUCTS_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItem.find(
      (item) => item.product.toString() === productId
    );

    // Check if the product is already in the user's cart

    if (existingItem) {
      // If the product is already in the cart, increment its quantity

      existingItem.quantity += 1;
    } else {
      // If the product is not in the cart, add it with a quantity of 1

      user.cartItem.push({
        product: productId,
      });
    }

    await user.save();

    return res.json(user.cartItem);
  } catch (error) {
    console.log(`[ADD_TO_CART_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function removeAllFromCart(req, res) {
  try {
    const user = req.user;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    } else {
      user.cartItem = user.cartItem.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await user.save();
    res.json(user.cartItem);
  } catch (error) {
    console.log(`[REMOVE_ALL_FROM_CART_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function updateQuantity(req, res) {
  try {
    const { quantity } = req.body;
    const { id: productId } = req.params;
    const user = req.user;

    const existingItem = user.cartItem.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (quantity <= 0) {
        user.cartItem = user.cartItem.filter((item) => item._id !== productId);
      } else {
        existingItem.quantity = quantity;
      }

      await user.save();
      return res.json(user.cartItem);
    }

    return res.status(404).json({
      message: "Product not found",
    });
  } catch (error) {
    console.log(`[UPDATE_QUANTITY_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
