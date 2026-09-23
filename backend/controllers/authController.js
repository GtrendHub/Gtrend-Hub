/**
 * Auth Controller
 */
const db = require('../models/db');
const { hashPassword, verifyPassword, generateToken } = require('../middleware/authMiddleware');

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const users = db.readCollection('users', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !verifyPassword(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid credentials provided' });
    }

    const token = generateToken(user);
    res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, course: user.course }
    });
};

exports.register = (req, res) => {
    const { fullName, email, password, phone, course, learningMode, experience, schedule, laptopChoice, laptopOS, address, reason, referral } = req.body;
    if (!fullName || !email) return res.status(400).json({ success: false, message: 'Full name and email are required' });

    const users = db.readCollection('users', []);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
        id: 'usr-' + Date.now().toString(36),
        name: fullName,
        email,
        phone: phone || '',
        role: 'student',
        course: course || 'General Tech Trainee',
        password: hashPassword(password || 'student123'),
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    db.writeCollection('users', users);

    // Also record into registrations database
    const registrations = db.readCollection('registrations', []);
    const appId = 'GTR-' + Math.floor(10000 + Math.random() * 90000);
    const regRecord = {
        appId,
        fullName,
        email,
        phone: phone || '',
        course: course || 'Full-Stack Web Engineering',
        learningMode: learningMode || 'Physical Hub / Hybrid',
        experience: experience || 'Beginner',
        schedule: schedule || 'Weekdays (Morning)',
        laptopChoice: laptopChoice || 'Have Laptop',
        laptopOS: laptopOS || 'Windows',
        address: address || '',
        reason: reason || '',
        referral: referral || 'Website',
        submissionDate: new Date().toLocaleString(),
        status: 'Pending Review',
        paymentStatus: req.body.paymentStatus || 'Unpaid',
        paymentReference: req.body.paymentReference || null
    };
    registrations.unshift(regRecord);
    db.writeCollection('registrations', registrations);

    const token = generateToken(newUser);
    res.status(201).json({
        success: true,
        message: 'Registration successful! Application reference: ' + appId,
        appId,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, course: newUser.course }
    });
};

exports.getProfile = (req, res) => {
    const users = db.readCollection('users', []);
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, course: user.course }
    });
};
