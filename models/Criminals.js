const mongoose = require('mongoose');

const CriminalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  ip: { type: String }
});

const Criminal = mongoose.model('Criminal', CriminalSchema);

module.exports = Criminal;
