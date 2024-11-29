const express = require('express');
const router = express.Router();
const { updateDiscount, getDiscount } = require('../controllers/discount.controller');

// Ruta para actualizar el descuento
router.post('/discount', updateDiscount, );
router.get('/discount', getDiscount);
module.exports = router;