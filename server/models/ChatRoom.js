const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    users: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      validate: {
        validator: function (users) {
          return (
            users.length === 2 && users[0].toString() !== users[1].toString()
          );
        },
        message: "A private room must contain exactly two different users",
      },
    },

    // Canonical key prevents duplicate rooms for the same two users.
    participantsKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
