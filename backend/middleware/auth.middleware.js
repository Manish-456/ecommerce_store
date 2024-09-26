import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description 
- This middleware function protects routes by verifying the access token provided in the request cookies.
- It checks if the access token is present, verifies it using the secret key, and retrieves the corresponding user from the database.
- If the token is valid and the user exists, it sets the req.user property and calls the next function in the middleware chain.
- Otherwise, it returns a 401 Unauthorized response with a JSON message indicating the reason for the failure (e.g., no token provided, token expired, or user not found). 
 */
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken)
      return res.status(401).json({
        message: "Unauthorized - No access token provided",
      });

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Unauthorized - Access token expired",
        });
      }

      throw error;
    }
  } catch (error) {
    console.log("[PROTECT_ROUTE_MD_ERROR]: ", error.message);

    return res.status(401).json({
      message: "Unauthorized - No access token provided",
    });
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @description 
 - This middleware function checks if the authenticated user has an 'admin' role.
 - If the user is an admin, it calls the next function in the middleware chain.
 - Otherwise, it returns a 403 Forbidden response with a JSON message indicating that access is denied for non-admin users. */

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied: Admin only",
    });
  }
};
