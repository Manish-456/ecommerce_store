import User from "../database/models/user.model.js";
import Order from "../database/models/order.model.js";
import Product from "../database/models/product.model.js";

/**
 * Retrieves the analytics data for the site.
 * The data includes the total number of users, products, sales, and revenue.
 * It also retrieves the daily sales data for the last 7 days.
 *
 * @param {Request} _req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @return {void} - Returns nothing, but sends a JSON response with the analytics data and daily sales data.
 */
export async function getAnalytics(_req, res) {
  try {
    // Retrieves the analytics data from the getAnalyticsData function
    const analyticsData = await getAnalyticsData();

    // Retrieves the daily sales data from the getDailySalesData function for the last 7 days
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({ analyticsData, dailySalesData });
  } catch (error) {
    console.log(`[GET_ANALYTICS_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/**
 * Retrieves the analytics data for the site.
 * The data includes the total number of users, products, sales, and revenue.
 *
 * @return {Object} The analytics data
 */
async function getAnalyticsData() {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  /**
   * Retrieves the total number of sales and revenue from the orders collection.
   * The aggregate method groups all documents together and sums up the total amount of each document.
   * The result is an array with one element containing the totalSales and totalRevenue properties.
   */
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // It groups all documents together
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  /**
   * Deconstructs the result from the aggregate method and assigns default values if the result is empty.
   */
  const { totalSales = 0, totalRevenue = 0 } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
}

/**
 * Retrieves the daily sales data between the given start date and end date.
 * The data is grouped by the date and includes the total number of sales and revenue for each date.
 * The method returns an array of objects with the date, sales, and revenue.
 * If there is no data for a given date, the method will return an object with the date and sales and revenue set to 0.
 * @param {Date} startDate The start date of the range.
 * @param {Date} endDate The end date of the range.
 * @returns {Object[]} An array of objects with the date, sales, and revenue.
 */
async function getDailySalesData(startDate, endDate) {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          // The _id field is set to the date part of the createdAt field using the $dateToString aggregation operator.
          // This groups the data by the date.
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          // The sales field is set to the sum of 1 for each document, which gives the total number of sales for each date.
          sales: { $sum: 1 },
          // The revenue field is set to the sum of the totalAmount field for each document, which gives the total revenue for each date.
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          // The data is sorted by the _id field in ascending order, which means the earliest date first.
          _id: 1,
        },
      },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    // The map method is used to transform the date array into an array of objects with the date, sales, and revenue.
    // If there is no data for a given date, the method will return an object with the date and sales and revenue set to 0.
    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Returns an array of dates in ISO format between the given start date and end date.
 * The array of dates will include the start date and end date.
 * @param {Date} startDate The start date of the range.
 * @param {Date} endDate The end date of the range.
 * @returns {string[]} An array of dates in ISO format.
 */
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // We only want the date part of the ISO string, so we split it and take the first part.
    dates.push(currentDate.toISOString().split("T")[0]);
    // Increment the date by one day to move to the next date in the range.
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
