/**
 * News & Events Controller
 */
const db = require('../models/db');

exports.getAllNews = (req, res) => {
    const { category, search } = req.query;
    let articles = db.readCollection('news', []);

    if (category && category !== 'All') {
        articles = articles.filter(a => a.category && a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
        const q = search.toLowerCase();
        articles = articles.filter(a =>
            (a.title && a.title.toLowerCase().includes(q)) ||
            (a.summary && a.summary.toLowerCase().includes(q)) ||
            (a.content && a.content.toLowerCase().includes(q))
        );
    }

    res.json({ success: true, count: articles.length, data: articles });
};

exports.getNewsById = (req, res) => {
    const articles = db.readCollection('news', []);
    const article = articles.find(a => a.id === req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: article });
};

exports.createNews = (req, res) => {
    const { title, category, author, image, summary, content, tags } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required' });

    const articles = db.readCollection('news', []);
    const newArticle = {
        id: 'news-' + Date.now().toString(36),
        title,
        category: category || 'News',
        author: author || 'Gtrend Editorial',
        image: image || './assets/images/hero-tech-bg.jpg',
        summary: summary || content.slice(0, 160) + '...',
        content,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['General']),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        createdAt: new Date().toISOString()
    };

    articles.unshift(newArticle);
    db.writeCollection('news', articles);
    res.status(201).json({ success: true, message: 'News article published successfully', data: newArticle });
};

exports.updateNews = (req, res) => {
    const articles = db.readCollection('news', []);
    const index = articles.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Article not found' });

    articles[index] = { ...articles[index], ...req.body, updatedAt: new Date().toISOString() };
    db.writeCollection('news', articles);
    res.json({ success: true, message: 'Article updated successfully', data: articles[index] });
};

exports.deleteNews = (req, res) => {
    let articles = db.readCollection('news', []);
    const beforeLength = articles.length;
    articles = articles.filter(a => a.id !== req.params.id);

    if (articles.length === beforeLength) return res.status(404).json({ success: false, message: 'Article not found' });
    db.writeCollection('news', articles);
    res.json({ success: true, message: 'Article deleted successfully' });
};
