const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import tras 
const subscriptionsRoutes = require('./routes/subscriptions');

const app = express();
const PORT = process.env.PORT || 5000;

//do polaczenia z react
app.use(cors());
app.use(express.json());

// podlaczenie tras
app.use('/api/subscriptions', subscriptionsRoutes);

// Polaczenie z baza danych MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Polaczono z baza danych MongoDB'))
    .catch((err) => console.error('Blad polaczenia z baza:', err));

// Testowy route
app.get('/', (req, res) => {
    res.send('Serwer dziala i API jest gotowe!');
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer nasluchuje na porcie: ${PORT}`);
});