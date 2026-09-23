const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student', 'instructor', 'staff'], default: 'student' },
    phone: { type: String, default: '' },
    course: { type: String, default: 'General Tech' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
