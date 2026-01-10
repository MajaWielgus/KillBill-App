const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//do polaczenia z react
app.use(cors());
app.use(express.json());

// Polaczenie z baza danych MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Połączono z bazą danych MongoDB'))
  .catch((err) => console.error('Błąd połączenia z MongoDB:', err));


// Import tras
const subscriptionsRouter = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionsRouter);

// Trasa do Logowania/Rejestracji
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter); // Będzie dostępne pod /api/auth/register

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer nasluchuje na porcie: ${PORT}`);
});

