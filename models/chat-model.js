const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default:false
    },
    groupIcon: {
        type: String,
        default:
          "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png",
      },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
          }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
