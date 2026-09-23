const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    service: { type: String, default: 'General Inquiry' },
    details: { type: String, required: true },
    status: { type: String, default: 'Unread' },
    time: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
