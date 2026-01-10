const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true //nazwa jest obowiązkowa
  },
  price: {
    type: Number,
    required: true //cena jest obowiązkowa
  },
  currency: {
    type: String,
    default: 'PLN' //jeśli nie ma waluty, domyślnie wpisze PLN
  },
  paymentDate: {
    type: Date,
    required: true // data jest obowiązkowa
  },
  category: {
    type: String,
    default: 'Inne' //np. Sport
  },
  // Powiązanie z użytkownikiem
  userId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);