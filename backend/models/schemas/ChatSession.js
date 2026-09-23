const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    sender: { type: String, enum: ['customer', 'bot', 'agent', 'system'], default: 'customer' },
    senderName: { type: String, default: 'Visitor' },
    text: { type: String, required: true },
    timestamp: { type: String }
});

const chatSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    customerName: { type: String, default: 'Website Visitor' },
    customerEmail: { type: String, default: '' },
    track: { type: String, default: 'General Inquiry' },
    status: { type: String, enum: ['bot', 'waiting_for_agent', 'active_agent', 'resolved'], default: 'waiting_for_agent' },
    assignedAgent: { type: String, default: null },
    messages: [messageSchema],
    resolvedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
