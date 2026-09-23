/**
 * Inquiries Controller
 */
const db = require('../models/db');

exports.getAllInquiries = (req, res) => {
    const inquiries = db.readCollection('inquiries', []);
    res.json({ success: true, count: inquiries.length, data: inquiries });
};

exports.createInquiry = (req, res) => {
    const { name, email, service, message, phone } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const inquiries = db.readCollection('inquiries', []);
    const newInquiry = {
        id: 'INQ-' + Date.now().toString(36).toUpperCase(),
        name,
        email,
        phone: phone || '',
        service: service || 'General Consultation',
        message,
        time: new Date().toLocaleString(),
        status: 'Unread',
        createdAt: new Date().toISOString()
    };

    inquiries.unshift(newInquiry);
    db.writeCollection('inquiries', inquiries);
    res.status(201).json({ success: true, message: 'Inquiry received. Our engineering team will contact you shortly.', data: newInquiry });
};

exports.deleteInquiry = (req, res) => {
    let inquiries = db.readCollection('inquiries', []);
    const beforeLength = inquiries.length;
    inquiries = inquiries.filter(i => i.id !== req.params.id);

    if (inquiries.length === beforeLength) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    db.writeCollection('inquiries', inquiries);
    res.json({ success: true, message: 'Inquiry removed' });
};
