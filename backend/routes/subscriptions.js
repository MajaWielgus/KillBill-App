const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// Metoda GET
router.get('/', async (req, res) => {
    try {
        // znajdzie wszystko w bazie
        const subs = await Subscription.find(); 
        // wysyla znalezione dane do Reacta jako JSON
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Metoda POST
router.post('/', async (req, res) => {
    // tworzy nowy obiekt na podstawie tego co przyszło od klienta
    const newSub = new Subscription({
        name: req.body.name,
        price: req.body.price,
        paymentDate: req.body.paymentDate,
        category: req.body.category
    });

    try {
        // proba zapisu w bazie
        const savedSub = await newSub.save();
        // odsyla potwierdzenie i zapisany obiekt
        res.status(201).json(savedSub);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Metoda DELETE
router.delete('/:id', async (req, res) => {
    try {
        // Znajdź w bazie element o tym ID i go usuń
        const removedSub = await Subscription.findByIdAndDelete(req.params.id);
        res.json(removedSub);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;