import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";
import redis from "../database/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    {
      userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Store refresh token to the redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export async function getProfile(req, res) {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("[GET_PROFILE_ERROR]: ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function signUp(req, res) {
  const { email, name, password } = req.body;

  try {
    // Check if user already exists in the database
    // If user exists, throw error message.
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({
      email,
      name,
      password,
    });

    // Save newly created user in the database.
    await user.save();

    // Authenticate user
    const { accessToken, refreshToken } = generateTokens(user._id);

    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      name,
      email,
      _id: user._id,
      role: user.role,
    });
  } catch (error) {
    console.log("[SIGNIN_ERROR]: ", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
export async function logIn(req, res) {
  const { email, password } = req.body;

  try {
    // Check if user already exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Authenticate user
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.log("[LOGIN_ERROR]: ", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
export async function logOut(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("[LOGOUT_ERROR]: ", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

// This will refresh the access token
export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(400).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevent CSRF attack, cross-site request forgery attack
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      message: "Token refreshed",
    });
  } catch (error) {
    console.log(`[REFRESH_ERROR]: ${error.message}`);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
