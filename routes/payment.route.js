const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/authenticate");
const paymentController = require('../controller/Payment.controller')

router.post('/createPayment', isAuth, paymentController.createPayment);
module.exports = router;

