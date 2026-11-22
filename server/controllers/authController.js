const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateAvatar = require("../utils/generateAvatar");
const { getAuth } = require("../config/firebaseAdmin");

// Cookie configuration shared by login and logout.
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
});

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // Check email first.
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Check username.
    const existingUsername = await User.findOne({
      username: normalizedUsername,
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      avatar: generateAvatar(fullName.trim()),
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      message: "User created successfully",
    });
  } catch (error) {
    // Handle duplicate-key errors caused by concurrent requests.
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }

      if (error.keyPattern?.username) {
        return res.status(409).json({
          success: false,
          message: "Username is already taken",
        });
      }
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the user",
    });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Password is excluded by default in the User model.
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with this email",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = generateToken(user._id);

    res.cookie("accessToken", accessToken, {
      ...getCookieOptions(),
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
        accessToken,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET /api/users/logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Error during logout process",
    });
  }
};

// GET /api/users/me
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Fetch current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET /api/users/firebase-token
const getFirebaseToken = async (req, res) => {
  try {
    const firebaseToken = await getAuth().createCustomToken(req.user._id.toString());
    return res.status(200).json({ success: true, data: { firebaseToken } });
  } catch (error) {
    console.error("Firebase token error:", error);
    return res.status(500).json({ success: false, message: "Could not generate Firebase token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getFirebaseToken,
};
