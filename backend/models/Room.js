const { Schema, model } = require('mongoose');
module.exports = model('Room', new Schema({
  number: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['Single', 'Double', 'Suite', 'Deluxe'], default: 'Single' },
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, default: 2, min: 1 },
  amenities: { type: String, default: '' },
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' }
}, { timestamps: true }));
