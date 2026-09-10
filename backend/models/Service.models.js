import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertProfile',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }, 
  price: {
    type: Number,
    required: true
  },
  consultationType: {
    type: String,
    enum: ['CHAT', 'AUDIO', 'VIDEO', 'ALL'],
    default: 'CHAT'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;