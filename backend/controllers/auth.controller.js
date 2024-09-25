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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 15 minutes
  });
};

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
      user: {
        name,
        email,
        _id: user._id,
        role: user.role,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export async function logIn(req, res) {
  return res.send("login called");
}
export async function logOut(req, res) {
  return res.send("logout called");
}
