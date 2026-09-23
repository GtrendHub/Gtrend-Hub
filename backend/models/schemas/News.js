const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Updates' },
    date: { type: String },
    author: { type: String, default: 'Gtrend Editorial' },
    image: { type: String, default: './assets/images/hero-tech-bg.jpg' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.News || mongoose.model('News', newsSchema);
