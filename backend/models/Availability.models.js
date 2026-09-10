import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertProfile',
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String, // Jaise "09:00 AM" ya "09:00" 
    required: true
  },
  endTime: {
    type: String, // Jaise "05:00 PM" ya "17:00"
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;