const { Schema, model } = require('mongoose');
module.exports = model('Guest', new Schema({
  name: { type: String, required: true, trim: true },
  email: String, phone: String, address: String, idProof: String
}, { timestamps: true }));
