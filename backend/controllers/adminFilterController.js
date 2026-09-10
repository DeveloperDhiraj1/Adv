import User from '../models/user.model.js';
import ExpertProfile from '../models/ExpertProfile.models.js';
import Booking from '../models/Booking.models.js';
import Payment from '../models/Payment.models.js';
import CallSession from '../models/CallSession.models.js';
import Dispute from '../models/Dispute.models.js';
import Payout from '../models/Payout.models.js';

import {
  getPagination,
  getDateFilter,
  getAmountFilter,
  getSort
} from '../utils/adminFilters.js';


export const filterUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { search, role, status } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -otp')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Users Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const filterExperts = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { search, verificationStatus } = req.query;

    const filter = {};

    if (verificationStatus) {
      filter.verificationStatus = verificationStatus;
    }

    if (search) {
      filter.$or = [
        { headline: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
        { expertise: { $regex: search, $options: 'i' } }
      ];
    }

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    const [experts, total] = await Promise.all([
      ExpertProfile.find(filter)
        .populate('userId', 'name email phone status')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      ExpertProfile.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: experts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Experts Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const filterBookings = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const {
      bookingStatus,
      paymentStatus
    } = req.query;

    const filter = {};

    if (bookingStatus) {
      filter.bookingStatus = bookingStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    Object.assign(
      filter,
      getAmountFilter(req.query.minAmount, req.query.maxAmount)
    );

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('userId', 'name email')
        .populate('expertId')
        .populate('serviceId', 'title price')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      Booking.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Bookings Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const filterPayments = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { paymentStatus, currency } = req.query;

    const filter = {};

    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (currency) filter.currency = currency;

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    Object.assign(
      filter,
      getAmountFilter(req.query.minAmount, req.query.maxAmount)
    );

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('userId', 'name email')
        .populate('bookingId')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      Payment.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Payments Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const filterDisputes = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { status } = req.query;

    const filter = {};

    if (status) filter.status = status;

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    const [disputes, total] = await Promise.all([
      Dispute.find(filter)
        .populate('raisedBy', 'name email')
        .populate('bookingId')
        .populate('resolvedBy', 'name email')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      Dispute.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: disputes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Disputes Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const filterCallSessions = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { status } = req.query;

    const filter = {};

    if (status) filter.status = status;

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    const [sessions, total] = await Promise.all([
      CallSession.find(filter)
        .populate('userId', 'name email')
        .populate('expertId')
        .populate('bookingId')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      CallSession.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Call Sessions Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const filterPayouts = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { status } = req.query;

    const filter = {};

    if (status) filter.status = status;

    Object.assign(
      filter,
      getDateFilter(req.query.dateFrom, req.query.dateTo)
    );

    Object.assign(
      filter,
      getAmountFilter(req.query.minAmount, req.query.maxAmount)
    );

    const [payouts, total] = await Promise.all([
      Payout.find(filter)
        .populate('expertId')
        .populate('bookingId')
        .populate('paymentId')
        .sort(getSort(req))
        .skip(skip)
        .limit(limit),

      Payout.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: payouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Filter Payouts Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};