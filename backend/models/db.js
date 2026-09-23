/**
 * Gtrend Tech Hub - Database Layer & MongoDB Connection Manager
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config');

// Import Mongoose Models
const User = require('./schemas/User');
const Registration = require('./schemas/Registration');
const News = require('./schemas/News');
const Gallery = require('./schemas/Gallery');
const Inquiry = require('./schemas/Inquiry');
const ChatSession = require('./schemas/ChatSession');
const Payment = require('./schemas/Payment');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CHAT_DIR = path.join(DATA_DIR, 'chat_sessions');

// Ensure directories exist for local JSON caching/fallback
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CHAT_DIR)) fs.mkdirSync(CHAT_DIR, { recursive: true });

let isMongoConnected = false;

/**
 * Connect to MongoDB instance (Local or Atlas)
 */
async function connectDB() {
    if (!config.MONGODB_URI) {
        console.log('ℹ️ [Database] No MONGODB_URI provided. Utilizing local JSON document database engine.');
        return false;
    }

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        isMongoConnected = true;
        console.log(`✅ [Database] MongoDB successfully connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
        return true;
    } catch (err) {
        isMongoConnected = false;
        console.warn(`⚠️ [Database] MongoDB connection error (${err.message}). Gracefully using local JSON storage engine.`);
        return false;
    }
}

mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
    console.warn('⚠️ [Database] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
    isMongoConnected = true;
    console.log('✅ [Database] MongoDB reconnected.');
});

function isConnected() {
    return isMongoConnected && mongoose.connection.readyState === 1;
}

// Local JSON Document Helper Functions
function getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection, defaultVal = []) {
    try {
        const file = getFilePath(collection);
        if (!fs.existsSync(file)) {
            writeCollection(collection, defaultVal);
            return defaultVal;
        }
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading collection ${collection}:`, err.message);
        return defaultVal;
    }
}

function writeCollection(collection, data) {
    try {
        const file = getFilePath(collection);
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error(`Error writing collection ${collection}:`, err.message);
        return false;
    }
}

// Chat sessions helper
function readChatSession(sessionId) {
    try {
        const file = path.join(CHAT_DIR, `${sessionId}.json`);
        if (!fs.existsSync(file)) return null;
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
        return null;
    }
}

function writeChatSession(sessionId, sessionData) {
    try {
        const file = path.join(CHAT_DIR, `${sessionId}.json`);
        fs.writeFileSync(file, JSON.stringify(sessionData, null, 2), 'utf8');
        return true;
    } catch (err) {
        return false;
    }
}

function listChatSessions() {
    try {
        const files = fs.readdirSync(CHAT_DIR);
        const sessions = [];
        files.forEach(f => {
            if (f.endsWith('.json')) {
                try {
                    const data = JSON.parse(fs.readFileSync(path.join(CHAT_DIR, f), 'utf8'));
                    sessions.push(data);
                } catch (e) {}
            }
        });
        return sessions.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    } catch (err) {
        return [];
    }
}

// Seed initial database defaults
function seedDefaults() {
    // 1. Seed News
    const news = readCollection('news', []);
    if (!news || news.length === 0) {
        writeCollection('news', [
            {
                id: 'news-1',
                title: 'Gtrend Hub Launches AI & Full-Stack Summer Bootcamp 2026',
                category: 'Events',
                date: 'September 18, 2026',
                author: 'Engr. Victor Clifford',
                image: './assets/images/course-web-dev.jpg',
                summary: 'Join over 150 emerging software developers and AI innovators in an intensive 12-week hands-on tech accelerator.',
                content: 'Gtrend Tech Hub has officially launched admission for the 2026 Full-Stack and AI Engineering Cohort. Trainees gain direct mentorship in building production apps, React/Node architectures, and automated intelligence pipelines.',
                tags: ['Bootcamp', 'FullStack', 'AI']
            },
            {
                id: 'news-2',
                title: 'Enterprise Starlink & Low-Latency Mesh Satellite Deployments',
                category: 'Projects',
                date: 'September 12, 2026',
                author: 'Engr. Benedict Anthony',
                image: './assets/images/starlink-network.jpg',
                summary: 'Providing uninterrupted high-speed internet to remote corporate facilities, research hubs, and offshore locations.',
                content: 'Our specialized connectivity division completed 45 high-speed Starlink deployments across the South-South region with 99.98% uptime SLA.',
                tags: ['Starlink', 'Connectivity', 'ICT']
            },
            {
                id: 'news-3',
                title: 'Next-Gen Cybersecurity & Cloud Defense Masterclass',
                category: 'Updates',
                date: 'September 05, 2026',
                author: 'Security Operations Team',
                image: './assets/images/cybersecurity.jpg',
                summary: 'Zero-trust security blueprints and proactive threat mitigation strategies for enterprise organizations.',
                content: 'A comprehensive briefing and interactive workshop for enterprise IT directors on defending cloud perimeters against modern attack vectors.',
                tags: ['Cybersecurity', 'Cloud', 'Workshops']
            }
        ]);
    }

    // 2. Seed Gallery
    const gallery = readCollection('gallery', []);
    if (!gallery || gallery.length === 0) {
        writeCollection('gallery', [
            { id: 'gal-1', title: 'Main Development Studio & Academy Floor', category: 'Campus', type: 'image', url: './assets/images/hero-tech-bg.jpg', description: 'State-of-the-art tech workspace equipped with ultra-fast mesh fiber connectivity.' },
            { id: 'gal-2', title: 'Full-Stack Software Lab in Action', category: 'Training', type: 'image', url: './assets/images/course-web-dev.jpg', description: 'Hands-on practical session building scalable Node.js and React web applications.' },
            { id: 'gal-3', title: 'AI & Data Engineering Workstations', category: 'Projects', type: 'image', url: './assets/images/ai-automation.jpg', description: 'Students designing automated intelligent workflows and machine learning models.' },
            { id: 'gal-4', title: 'Enterprise Satellite & Network Testing Lab', category: 'Lab', type: 'image', url: './assets/images/starlink-network.jpg', description: 'Engineers configuring failover routing and Starlink satellite arrays.' },
            { id: 'gal-5', title: 'Cyber Threat Defense Operations Center', category: 'Lab', type: 'image', url: './assets/images/cybersecurity.jpg', description: 'Live threat monitoring and vulnerability auditing simulation room.' }
        ]);
    }

    // 3. Seed Chat Status
    const status = readCollection('chat_status', null);
    if (!status || !status.status) {
        writeCollection('chat_status', {
            status: 'online', // 'online' | 'busy' | 'offline'
            activeAgent: 'Support Specialist',
            lastUpdated: new Date().toISOString(),
            welcomeMessage: 'Hello! Welcome to Gtrend Tech Hub. How can our team assist you today?'
        });
    }

    // 4. Seed other collections
    readCollection('users', []);
    readCollection('payments', []);
    readCollection('registrations', []);
    readCollection('inquiries', []);
}

seedDefaults();

module.exports = {
    // Mongo Connection
    connectDB,
    isConnected,
    mongoose,

    // Mongoose Models
    User,
    Registration,
    News,
    Gallery,
    Inquiry,
    ChatSession,
    Payment,
    models: {
        User,
        Registration,
        News,
        Gallery,
        Inquiry,
        ChatSession,
        Payment
    },

    // JSON Document Storage
    readCollection,
    writeCollection,
    readChatSession,
    writeChatSession,
    listChatSessions,
    DATA_DIR,
    CHAT_DIR
};
