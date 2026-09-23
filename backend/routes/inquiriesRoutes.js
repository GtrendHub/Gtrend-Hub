const express = require('express');
const router = express.Router();
const inquiriesController = require('../controllers/inquiriesController');

router.get('/', inquiriesController.getAllInquiries);
router.post('/', inquiriesController.createInquiry);
router.delete('/:id', inquiriesController.deleteInquiry);

module.exports = router;
