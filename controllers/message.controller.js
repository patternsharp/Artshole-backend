const Message = require("../models/Message");
const Chat = require("../models/Chat");

// Send New Message
exports.NewMessage = async (req, res) => {
  try {
    const { senderId, receiverId, chatId, content } = req.body;

    const msgData = {
      sender: senderId,
      chatId: chatId,
      content: content,
    };

    const newMessage = await Message.create(msgData);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    return res.status(200).send({ status: true, newMessage: newMessage });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Get All Messages
exports.GetMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messageList = await Message.find({ chatId: chatId });

    if (!messageList) {
      messageList = [];
    }

    return res.status(200).send({ status: true, messageList: messageList });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
