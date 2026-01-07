const mongoose = require('mongoose');

//jak wygląda jedna subskrypcja:
const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, //nazwa jest obowiązkowa
  },
  price: {
    type: Number,
    required: true, //cena jest obowiązkowa
  },
  currency: {
    type: String,
    default: 'PLN', //jeśli nie ma waluty, domyślnie wpisze PLN
  },
  paymentDate: {
    type: Date,
    required: true, //data płatności jest obowiązkowa
  },
  category: {
    type: String, //np. Sport
    default: 'Inne'
  }
});

// Tworzymy model na podstawie schematu i eksportujemy go
module.exports = mongoose.model('Subscription', subscriptionSchema);