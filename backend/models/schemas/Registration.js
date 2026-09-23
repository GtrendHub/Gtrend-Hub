const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    appId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    course: { type: String, default: 'Full-Stack Web Engineering' },
    learningMode: { type: String, default: 'Physical Hub / Hybrid' },
    experience: { type: String, default: 'Beginner' },
    schedule: { type: String, default: 'Weekdays (Morning)' },
    laptopChoice: { type: String, default: 'Have Laptop' },
    laptopOS: { type: String, default: 'Windows' },
    address: { type: String, default: '' },
    reason: { type: String, default: '' },
    referral: { type: String, default: 'Website' },
    submissionDate: { type: String },
    status: { type: String, default: 'Pending Review' },
    paymentStatus: { type: String, default: 'Unpaid' },
    paymentReference: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
