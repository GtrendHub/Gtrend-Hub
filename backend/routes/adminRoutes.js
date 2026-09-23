const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getStats);
router.get('/registrations', adminController.getRegistrations);
router.post('/registrations/update-status', adminController.updateRegistrationStatus);
router.delete('/registrations/:appId', adminController.deleteRegistration);

module.exports = router;
