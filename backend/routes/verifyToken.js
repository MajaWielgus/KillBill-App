const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Pobierze token z nagłówka zapytania
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Odmowa dostępu - brak tokena');

  try {
    // Zweryfikuje token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'tajnyKlucz');
    req.user = verified; // Zapisze ID użytkownika w zapytaniu
    next(); // Puść dalej (do trasy subskrypcji)
  } catch (err) {
    res.status(400).send('Nieprawidłowy token');
  }
};