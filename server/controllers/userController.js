const User = require("../models/User");

// GET /api/users/search?searchTerm=
const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    // Escape special regex characters to treat the input as plain text.
    const escapedSearchTerm = searchTerm
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedSearchTerm, "i");

    const users = await User.find({
      $or: [{ username: searchRegex }, { email: searchRegex }],
      _id: { $ne: req.user._id },
    }).select("fullName username email avatar");

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error("Search users error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  searchUsers,
};
