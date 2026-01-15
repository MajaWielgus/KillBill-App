const router = require('express').Router();
const Subscription = require('../models/Subscription');
const verify = require('./verifyToken'); // Importujemy naszego ochroniarza



// POBIERANIE (Tylko subskrypcje zalogowanego użytkownika)
router.get('/', verify, async (req, res) => {
    try {
        // Szukamy w bazie subskrypcji, gdzie userId == ID zalogowanego
        const subs = await Subscription.find({ userId: req.user._id});
        res.json(subs);
    } catch (err) {
        res.json({ message: err });
    }
});




// DODAWANIE
router.post('/', verify, async (req, res) => {
    // podgląd w terminalu: czy serwer widzi ID użytkownika
    console.log("Próba dodania subskrypcji dla User ID:", req.user._id);

    const subscription = new Subscription({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        paymentDate: req.body.paymentDate,
        userId: req.user._id, // tu przypisujemy właściciela
        frequency: req.body.frequency
    });

    try {
        const savedSub = await subscription.save();
        console.log("Sukces! Zapisano w bazie:", savedSub);
        res.json(savedSub);
    } catch (err) {
        console.error("Błąd zapisu do bazy:", err); 
        res.status(400).json({ message: err.message });
    }
});


// USUWANIE (Musi być zweryfikowany)
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedSub = await Subscription.findByIdAndDelete(req.params.id);
        res.json(removedSub);
    } catch (err) {
        res.json({ message: err });
    }
});

// EDYCJA (Musi być zweryfikowany)
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedSub = await Subscription.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedSub);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;