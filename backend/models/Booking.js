const { Schema, model } = require('mongoose');
module.exports = model('Booking', new Schema({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  guest: { type: Schema.Types.ObjectId, ref: 'Guest', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  status: { type: String, enum: ['reserved', 'checked-in', 'checked-out', 'cancelled'], default: 'reserved' },
  total: { type: Number, default: 0 },
  paid: { type: Number, default: 0 }
}, { timestamps: true }));
