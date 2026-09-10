import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.models.js';
import Service from '../models/Service.models.js';
import Payment from '../models/Payment.models.js';
import Notification from '../models/Notification.models.js';

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};


export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance(); 
    const userId = req.user.id;
    const { serviceId, scheduledAt } = req.body;

    const service = await Service.findById(serviceId).populate('expertId');
    if (!service || service.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: "Service not found or inactive" });
    }

    const booking = new Booking({
      userId,
      expertId: service.expertId._id,
      serviceId,
      scheduledAt,
      amount: service.price,
      paymentStatus: 'PENDING',
      bookingStatus: 'PENDING'
    });
    await booking.save();

    const options = {
      amount: service.price * 100,
      currency: "INR",
      receipt: `receipt_booking_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      userId,
      bookingId: booking._id,
      razorpayOrderId: order.id,
      amount: service.price,
      paymentStatus: 'PENDING'
    });
    await payment.save();

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'PAID',
        bookingStatus: 'CONFIRMED'
      }, { new: true }).populate('serviceId expertId');

      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'SUCCESS'
        }
      );
      await Notification.create({
        userId: req.user.id,
        type: 'PAYMENT',
        title: 'Payment Successful',
        message: 'Your payment was successful and your booking has been confirmed.',
        bookingId
      });

      // Create notification for expert
      await Notification.create({
        userId: booking.expertId._id,
        type: 'BOOKING',
        title: 'New Booking Received',
        message: `You have a new booking scheduled for ${new Date(booking.scheduledAt).toLocaleDateString()}`,
        bookingId
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully and booking confirmed!",
        booking: {
          id: booking._id,
          amount: booking.amount,
          scheduledAt: booking.scheduledAt,
          bookingStatus: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          serviceTitle: booking.serviceId?.title,
          expertName: booking.expertId?.headline || 'Expert'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (status) {
      query.paymentStatus = status;
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate('bookingId')
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'serviceId', select: 'title price' },
          { path: 'expertId', select: 'headline' }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      count: payments.length,
      totalCount,
      totalPages,
      currentPage: parseInt(page),
      data: payments.map((payment) => ({
        id: payment._id,
        transactionId: payment.razorpayPaymentId || payment.razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.paymentStatus,
        date: payment.createdAt,
        serviceName: payment.bookingId?.serviceId?.title,
        expertName: payment.bookingId?.expertId?.headline,
        bookingId: payment.bookingId?._id,
        bookingStatus: payment.bookingId?.bookingStatus,
        scheduledAt: payment.bookingId?.scheduledAt
      }))
    });
  } catch (error) {
    console.error("Get User Payments Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};