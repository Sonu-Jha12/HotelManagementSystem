const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Service = require('../models/Service');
const { asyncHandler, HttpError } = require('../middleware/error');

const ACTIVE = ['reserved', 'checked-in'];
const nights = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 864e5));
const populate = q => q.populate('room', 'number type price').populate('guest', 'name phone email');
const overlap = (room, from, to) => Booking.exists({
  room, status: { $in: ACTIVE }, checkIn: { $lt: new Date(to) }, checkOut: { $gt: new Date(from) } });

exports.list = asyncHandler(async (req, res) => res.json(await populate(Booking.find().sort('-createdAt'))));

exports.create = asyncHandler(async (req, res) => {
  const { room, guest, checkIn, checkOut, guests = 1 } = req.body;
  if (new Date(checkOut) <= new Date(checkIn)) throw HttpError(400, 'Check-out must be after check-in');
  const r = await Room.findById(room);
  if (!r || r.status !== 'available') throw HttpError(400, 'Room is not available');
  if (guests > r.capacity) throw HttpError(400, `Room ${r.number} fits ${r.capacity} guests`);
  if (await overlap(room, checkIn, checkOut)) throw HttpError(409, 'Room is already booked for these dates');
  const b = await Booking.create({ room, guest, checkIn, checkOut, guests, total: nights(checkIn, checkOut) * r.price });
  res.status(201).json(await populate(Booking.findById(b._id)));
});

exports.setStatus = asyncHandler(async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) throw HttpError(404, 'Booking not found');
  b.status = req.body.status;
  await b.save();
  res.json(await populate(Booking.findById(b._id)));
});

exports.addPayment = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!(amount > 0)) throw HttpError(400, 'Enter a payment amount above 0');
  res.json(await Booking.findByIdAndUpdate(req.params.id, { $inc: { paid: amount } }, { new: true }));
});

exports.addService = asyncHandler(async (req, res) => {
  const s = await Service.create({ booking: req.params.id, name: req.body.name, amount: req.body.amount });
  await Booking.findByIdAndUpdate(req.params.id, { $inc: { total: s.amount } });
  res.status(201).json(s);
});
exports.listServices = asyncHandler(async (req, res) => res.json(await Service.find({ booking: req.params.id })));

exports.remove = asyncHandler(async (req, res) => {
  await Service.deleteMany({ booking: req.params.id });
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

exports.availableRooms = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) throw HttpError(400, 'Choose both dates');
  const busy = await Booking.find({ status: { $in: ACTIVE }, checkIn: { $lt: new Date(to) }, checkOut: { $gt: new Date(from) } }).distinct('room');
  res.json(await Room.find({ status: 'available', _id: { $nin: busy } }));
});

exports.guard = async (field, id) => {
  if (await Booking.exists({ [field]: id, status: { $in: ACTIVE } })) throw HttpError(409, 'There are active bookings for this record');
};
