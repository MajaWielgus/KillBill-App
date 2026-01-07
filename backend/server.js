const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// do polaczenia z react
app.use(cors());
app.use(express.json());

// Polaczenie z baza danych MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Polaczono z baza danych MongoDB'))
    .catch((err) => console.error('Blad polaczenia z baza:', err));

// Testowy route
app.get('/', (req, res) => {
    res.send('Serwer dziala poprawnie');
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer nasluchuje na porcie: ${PORT}`);
});