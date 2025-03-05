const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  fullName: { type: String, required: true }
});


module.exports = mongoose.model('UserData', userSchema);