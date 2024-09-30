import stripe from "../lib/stripe.js";
import Coupon from "../database/models/coupon.model.js";
import Order from "../database/models/order.model.js";
/**
 * Creates a Stripe checkout session with the given products and coupon.
 * If the total amount of the products is greater than or equal to $200, creates a new coupon.
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @return {Object} A JSON response indicating the success or failure of the operation
 */
export async function createCheckoutSession(req, res) {
  try {
    const { products, coupon } = req.body;

    // Check if the products array is valid
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Invalid or empty products",
      });
    }

    // Convert the products array to Stripe price_data objects
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity || 1,
    }));

    // Calculate the total amount of the products
    const totalAmount = lineItems.reduce(
      (acc, item) => acc + item.price_data.unit_amount * item.quantity,
      0
    );

    let couponDiscount = 0;
    if (coupon) {
      const couponData = await Coupon.findOne({
        code: coupon,
        userId: req.user._id,
        isActive: true,
      });

      // If the coupon is valid, calculate the discount
      if (couponData) {
        couponDiscount = Math.round(
          (totalAmount * couponData.discountPercentage) / 100
        );
      }
    }

    // Create a Stripe checkout session with the given products and coupon
    const session = await stripe.checkout.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id=${CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(couponDiscount),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: coupon || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // If the total amount is greater than or equal to $200, create a new coupon
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/**
 * Handles a successful checkout by retrieving the Stripe session,
 * deactivating any used coupons, creating a new order, and saving it to the database.
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @return {Object} A JSON response indicating the success or failure of the operation
 */
export async function checkoutSuccess(req, res) {
  try {
    const { sessionId } = req.body;

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // If the payment was successful, deactivate any used coupon
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        // Deactivate the coupon
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }
    }

    const products = JSON.parse(session.metadata.products);

    // Create a new Order
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: sessionId,
    });

    // Save the new order to the database
    await newOrder.save();

    // Return a success response with the order ID
    res.status(200).json({
      success: true,
      message: "Payment successful, order created, and coupon deactivated",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("[CHECKOUT_SUCCESS_ERROR]", error.message);
    return res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
}

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}
async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now,
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}
