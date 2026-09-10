import Conversation from '../models/Conversation.models.js';
import Message from '../models/Message.models.js';

 
export const accessConversation = async (req, res) => {
  try {
    const { receiverId, expertId } = req.body;
    const userId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
      expertId: expertId
    }).populate('participants', 'name email role');

    if (conversation) {
      return res.status(200).json({ success: true, data: conversation });
    }

    conversation = new Conversation({
      participants: [userId, receiverId],
      expertId: expertId
    });

    await conversation.save();
    const fullConversation = await Conversation.findById(conversation._id).populate('participants', 'name email role');

    return res.status(201).json({ success: true, data: fullConversation });

  } catch (error) {
    console.error("Access Conversation Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    if (!text || !conversationId) {
      return res.status(400).json({ success: false, message: "Text and conversationId are required" });
    }

    const message = new Message({
      conversationId,
      sender: senderId,
      text
    });

    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageTime: Date.now()
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name role');

    return res.status(201).json({ success: true, data: populatedMessage });

  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 3. Kisi Chat ke saare Messages dekhne ke liye
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Conversation.find({ participants: userId })
      .populate('participants', 'name email role')
      .populate('expertId')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });

  } catch (error) {
    console.error("Get User Chats Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};