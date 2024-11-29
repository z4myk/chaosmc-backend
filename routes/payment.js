const express = require("express");
const router = express.Router();

const {createOrderNotified, fetchOrderNotified,  getOneOrderNotified,
    deleteOrderNotified,} = require('../controllers/payment.controller');

router.post("/payment", createOrderNotified);

router.get("/payment", fetchOrderNotified); 
router.get("/payment/:id", getOneOrderNotified);
router.delete("/payment/:id", deleteOrderNotified );
module.exports = router;