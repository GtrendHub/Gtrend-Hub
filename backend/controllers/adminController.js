/**
 * Admin Controller
 */
const db = require('../models/db');

exports.getStats = (req, res) => {
    const users = db.readCollection('users', []);
    const news = db.readCollection('news', []);
    const gallery = db.readCollection('gallery', []);
    const inquiries = db.readCollection('inquiries', []);
    const registrations = db.readCollection('registrations', []);
    const payments = db.readCollection('payments', []);
    const chatSessions = db.listChatSessions();

    const activeChats = chatSessions.filter(c => c.status === 'active_agent' || c.status === 'waiting_for_agent').length;
    const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    res.json({
        success: true,
        data: {
            totalUsers: users.length,
            totalStudents: registrations.length,
            totalNews: news.length,
            totalGallery: gallery.length,
            totalInquiries: inquiries.length,
            totalPayments: payments.length,
            totalRevenue,
            activeChats
        }
    });
};

exports.getRegistrations = (req, res) => {
    const registrations = db.readCollection('registrations', []);
    res.json({ success: true, count: registrations.length, data: registrations });
};

exports.updateRegistrationStatus = (req, res) => {
    const { appId, status, paymentStatus } = req.body;
    if (!appId) return res.status(400).json({ success: false, message: 'Application ID required' });

    const registrations = db.readCollection('registrations', []);
    const index = registrations.findIndex(r => r.appId === appId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Registration record not found' });

    if (status) registrations[index].status = status;
    if (paymentStatus) registrations[index].paymentStatus = paymentStatus;
    registrations[index].updatedAt = new Date().toISOString();

    db.writeCollection('registrations', registrations);
    res.json({ success: true, message: 'Status updated for application ' + appId, data: registrations[index] });
};

exports.deleteRegistration = (req, res) => {
    let registrations = db.readCollection('registrations', []);
    const beforeLength = registrations.length;
    registrations = registrations.filter(r => r.appId !== req.params.appId);

    if (registrations.length === beforeLength) return res.status(404).json({ success: false, message: 'Registration not found' });
    db.writeCollection('registrations', registrations);
    res.json({ success: true, message: 'Application record removed' });
};
