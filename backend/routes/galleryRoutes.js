const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.get('/', galleryController.getAllGallery);
router.post('/', galleryController.createGalleryItem);
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
