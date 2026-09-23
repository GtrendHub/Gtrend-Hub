const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.get('/config', paymentsController.getConfig);
router.post('/record', paymentsController.recordPayment);
router.get('/verify/:reference', paymentsController.verifyPayment);
router.get('/all', paymentsController.getAllPayments);

module.exports = router;
