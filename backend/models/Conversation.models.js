import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertProfile',
    required: true
  },
  lastMessage: {
    type: String,
    default: ""
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;