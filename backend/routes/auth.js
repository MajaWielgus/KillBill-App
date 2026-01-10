const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//REJESTRACJA
router.post('/register', async (req, res) => {
  try {
    // Sprawdza czy użytkownik istnieje
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return res.status(400).json({ message: 'Taki użytkownik już istnieje!' });
    }

    // Zaszyfruje hasło
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Stworzy użytkownika
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    res.json({ message: 'Użytkownik zarejestrowany!', userId: savedUser._id });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOWANIE 
router.post('/login', async (req, res) => {
  try {
    // 1 Szuka użytkownika po loginie
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ message: 'Błędny login lub hasło' });

    // 2 Sprawdza czy hasło pasuje (porównujemy to wpisane z tym zaszyfrowanym w bazie)
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Błędny login lub hasło' });

    // 3 Stworzy TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'tajnyKlucz');

    // 4 Wyśle token do Reacta
    res.header('auth-token', token).json({ token: token, message: 'Zalogowano!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;