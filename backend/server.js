/**
 * Gtrend Tech Hub - Standalone REST API Server
 */
const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB, isConnected } = require('./models/db');

// Initialize database connection
connectDB().catch(() => {});

const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless DB connection middleware (ensures Mongo is connected on cold starts)
app.use(async (req, res, next) => {
    if (!isConnected()) {
        try {
            await connectDB();
        } catch (e) {}
    }
    next();
});

// Import API routes
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

// Root API Discovery Endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'Gtrend Tech Hub REST API',
        version: '2.0.0',
        status: 'Online',
        database: isConnected() ? 'MongoDB (Connected)' : 'JSON Document Engine (Active)',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            news: '/api/news',
            gallery: '/api/gallery',
            inquiries: '/api/inquiries',
            chat: '/api/chat',
            payments: '/api/payments',
            admin: '/api/admin'
        },
        timestamp: new Date().toISOString()
    });
});

// System Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'Gtrend Tech Hub API',
        version: '2.0.0',
        database: isConnected() ? 'MongoDB (Connected)' : 'JSON Document Engine (Active)',
        platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Express',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler for undefined API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found on this API server.`
    });
});

const PORT = config.PORT;

// Start listener for traditional server / container environments
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 Gtrend Tech Hub REST API Server running on PORT: ${PORT}`);
        console.log(`   🌐 API Root:         http://localhost:${PORT}/`);
        console.log(`   ❤️ Health:           http://localhost:${PORT}/api/health`);
        console.log(`   🔐 Auth:             http://localhost:${PORT}/api/auth`);
        console.log(`   📰 News:             http://localhost:${PORT}/api/news`);
        console.log(`   🖼️ Gallery:          http://localhost:${PORT}/api/gallery`);
        console.log(`   💬 Inquiries:        http://localhost:${PORT}/api/inquiries`);
        console.log(`   🤖 Live Chat:        http://localhost:${PORT}/api/chat`);
        console.log(`   💳 Payments:         http://localhost:${PORT}/api/payments`);
        console.log(`   👑 Admin:            http://localhost:${PORT}/api/admin`);
        console.log(`====================================================`);
    });
}

module.exports = app;
