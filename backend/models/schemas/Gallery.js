const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Campus' },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
