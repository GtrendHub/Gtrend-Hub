/**
 * Gtrend Tech Hub - Authentication Middleware
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const db = require('../models/db');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password + '_gtrend_salt_2026').digest('hex');
}

function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
}

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        config.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (e) {
        return null;
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(403).json({ success: false, message: 'Invalid or expired session token' });

    req.user = decoded;
    next();
}

function requireAdmin(req, res, next) {
    authenticateToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Admin access privileges required' });
        }
    });
}

// Seed default users if none exist
function seedUsers() {
    const users = db.readCollection('users', []);
    if (!users || users.length === 0) {
        db.writeCollection('users', [
            {
                id: 'usr-admin-1',
                email: 'admin@gtrend.com',
                name: 'Administrator',
                role: 'admin',
                password: hashPassword('admin123'),
                createdAt: new Date().toISOString()
            },
            {
                id: 'usr-student-1',
                email: 'student@gtrend.com',
                name: 'Alex Samuel',
                role: 'student',
                course: 'Full-Stack Web Engineering',
                password: hashPassword('student123'),
                createdAt: new Date().toISOString()
            }
        ]);
    }
}

seedUsers();

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    authenticateToken,
    requireAdmin
};
