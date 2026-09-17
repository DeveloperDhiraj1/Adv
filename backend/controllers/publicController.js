import ContactMessage from '../models/ContactMessage.models.js';
import Subscriber from '../models/Subscriber.models.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ success: false, message: 'Name, email, subject and message are required' });
    const contact = await ContactMessage.create({ name, email, phone, subject, message });
    return res.status(201).json({ success: true, message: 'Your message has been received.', data: contact });
  } catch (error) {
    console.error('Contact message error:', error);
    return res.status(500).json({ success: false, message: 'Unable to send your message' });
  }
};

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    await Subscriber.findOneAndUpdate({ email: email.toLowerCase().trim() }, { email: email.toLowerCase().trim(), active: true }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({ success: true, message: 'You are subscribed successfully.' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ success: false, message: 'Unable to subscribe right now' });
  }
};
