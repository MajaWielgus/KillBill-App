const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Login musi być unikalny (nie może być dwóch takich samych)
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Hasło musi mieć minimum 6 znaków
  }
});

module.exports = mongoose.model('User', userSchema);