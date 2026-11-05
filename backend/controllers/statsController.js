const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { asyncHandler } = require('../middleware/error');

exports.dashboard = asyncHandler(async (req, res) => {
  const day = new Date(); day.setHours(0, 0, 0, 0);
  const next = new Date(day.getTime() + 864e5);
  const since = new Date(day.getFullYear(), day.getMonth() - 5, 1);
  const [rooms, occupied, arrivals, departures, money, monthly, recent] = await Promise.all([
    Room.countDocuments(),
    Booking.countDocuments({ status: 'checked-in' }),
    Booking.countDocuments({ status: 'reserved', checkIn: { $gte: day, $lt: next } }),
    Booking.countDocuments({ status: 'checked-in', checkOut: { $gte: day, $lt: next } }),
    Booking.aggregate([{ $match: { status: { $in: ['checked-in', 'checked-out'] } } }, { $group: { _id: null, total: { $sum: '$total' }, paid: { $sum: '$paid' } } }]),
    Booking.aggregate([{ $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Booking.find().sort('-createdAt').limit(5).populate('room', 'number').populate('guest', 'name')
  ]);
  res.json({ rooms, occupied, arrivals, departures, revenue: money[0]?.total || 0, collected: money[0]?.paid || 0, monthly, recent });
});
