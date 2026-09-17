import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 30 },
  subject: { type: String, required: true, trim: true, maxlength: 150 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ['NEW', 'IN_PROGRESS', 'RESOLVED'], default: 'NEW' }
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
