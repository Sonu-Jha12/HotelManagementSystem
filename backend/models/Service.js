const { Schema, model } = require('mongoose');
// Extra charges added to a booking (room service, laundry, spa...)
module.exports = model('Service', new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true }));
