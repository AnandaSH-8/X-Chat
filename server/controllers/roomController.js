const mongoose = require("mongoose");
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");

// POST /api/rooms/init
const initializeRoom = async (req, res) => {
  try {
    const { otheruser } = req.body;

    if (!otheruser) {
      return res.status(400).json({
        success: false,
        message: "Other user is required to create a chat room",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(otheruser)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const currentUserId = req.user._id;
    const otherUserId = new mongoose.Types.ObjectId(otheruser);

    // A user cannot create a private room with themselves.
    if (currentUserId.equals(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot create a chat room with yourself",
      });
    }

    // Verify that the other participant exists.
    const otherUserExists = await User.exists({
      _id: otherUserId,
    });

    if (!otherUserExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a consistent key regardless of participant order.
    const participantsKey = [currentUserId.toString(), otherUserId.toString()]
      .sort()
      .join("_");

    // Return existing room if one already exists.
    let room = await ChatRoom.findOne({
      participantsKey,
    }).populate("users", "fullName username email avatar");

    if (room) {
      return res.status(200).json({
        success: true,
        data: toRoomDTO(room),
        message: "Room initialized successfully",
      });
    }

    try {
      room = await ChatRoom.create({
        users: [currentUserId, otherUserId],
        participantsKey,
      });
    } catch (error) {
      // Another simultaneous request may have created this room.
      if (error.code !== 11000) {
        throw error;
      }

      room = await ChatRoom.findOne({
        participantsKey,
      });
    }

    // Populate user details before sending the response.
    await room.populate("users", "fullName username email avatar");

    return res.status(200).json({
      success: true,
      data: toRoomDTO(room),
      message: "Room initialized successfully",
    });
  } catch (error) {
    console.error("Initialize room error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while initializing the room",
    });
  }
};

const toRoomDTO = (room) => {
  const obj = room.toObject();
  obj.members = obj.users;
  delete obj.users;
  return obj;
};

// GET /api/rooms/userrooms
const getUserRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      users: req.user._id,
    })
      .populate("users", "fullName username email avatar")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: rooms.map(toRoomDTO),
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    console.error("Fetch user rooms error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching rooms",
    });
  }
};

module.exports = {
  initializeRoom,
  getUserRooms,
};
