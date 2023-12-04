const Chat = require("../models/Chat");

// Create New Chat
exports.NewChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const chatExists = await Chat.findOne({
      users: {
        $all: [senderId, receiverId],
      },
    });

    if (chatExists) {
      return res.status(200).send({ status: true, newChat: chatExists });
    }

    const newChat = await Chat.create({ users: [senderId, receiverId] });

    return res.status(200).send({ status: true, newChat: newChat });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Get All Chats
exports.GetChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatList = await Chat.find({ users: { $in: [userId] } })
      .sort({ updatedAt: -1 })
      .populate("users latestMessage");

    return res.status(200).send({ status: true, chatList: chatList });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
