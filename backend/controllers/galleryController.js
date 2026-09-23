/**
 * Gallery Controller
 */
const db = require('../models/db');

exports.getAllGallery = (req, res) => {
    const { category, type } = req.query;
    let items = db.readCollection('gallery', []);

    if (category && category !== 'All') {
        items = items.filter(i => i.category && i.category.toLowerCase() === category.toLowerCase());
    }

    if (type && type !== 'All') {
        items = items.filter(i => i.type && i.type.toLowerCase() === type.toLowerCase());
    }

    res.json({ success: true, count: items.length, data: items });
};

exports.createGalleryItem = (req, res) => {
    const { title, category, type, url, description } = req.body;
    if (!title || !url) return res.status(400).json({ success: false, message: 'Title and media URL are required' });

    const items = db.readCollection('gallery', []);
    const newItem = {
        id: 'gal-' + Date.now().toString(36),
        title,
        category: category || 'Campus',
        type: type || (url.includes('youtube') || url.includes('vimeo') || url.endsWith('.mp4') ? 'video' : 'image'),
        url,
        description: description || '',
        createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    db.writeCollection('gallery', items);
    res.status(201).json({ success: true, message: 'Media item added to gallery', data: newItem });
};

exports.deleteGalleryItem = (req, res) => {
    let items = db.readCollection('gallery', []);
    const beforeLength = items.length;
    items = items.filter(i => i.id !== req.params.id);

    if (items.length === beforeLength) return res.status(404).json({ success: false, message: 'Item not found' });
    db.writeCollection('gallery', items);
    res.json({ success: true, message: 'Media item removed' });
};
