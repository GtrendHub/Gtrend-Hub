/**
 * Gtrend Tech Hub - Main Express Server
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { connectDB, isConnected } = require('./models/db');

// Initialize database connection
connectDB();

const app = express();
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from frontend directory
app.use(express.static(FRONTEND_DIR));

// Import routes
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const inquiriesRoutes = require('./routes/inquiriesRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

// System health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'Gtrend Tech Hub API',
        version: '2.0.0',
        database: isConnected() ? 'MongoDB (Connected)' : 'JSON Document Engine (Active)',
        timestamp: new Date().toISOString()
    });
});

// Explicit Page Routing Fallback
app.get('/', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'about.html')));
app.get('/services', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'services.html')));
app.get('/courses', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'courses.html')));
app.get('/news', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'news.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'gallery.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'contact.html')));

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Gtrend Tech Hub Platform Server running on:`);
    console.log(`   🌐 Home:             http://localhost:${PORT}`);
    console.log(`   💡 Services:         http://localhost:${PORT}/services.html`);
    console.log(`   🎓 Courses:          http://localhost:${PORT}/courses.html`);
    console.log(`   📰 News & Updates:   http://localhost:${PORT}/news.html`);
    console.log(`   🖼️ Gallery:         http://localhost:${PORT}/gallery.html`);
    console.log(`   ℹ️ About:           http://localhost:${PORT}/about.html`);
    console.log(`   📞 Contact:          http://localhost:${PORT}/contact.html`);
    console.log(`   📱 Admin Dashboard:  http://localhost:${PORT}/admin/index.html`);
    console.log(`====================================================`);
});
