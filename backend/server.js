const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//do łączenia się z Reactem
app.use(cors());
app.use(express.json());

// testowy adres - czy działa
app.get('/', (req, res) => {
    res.send('Serwer KillBill działa');
});

// start serwera
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie: ${PORT}`);
});