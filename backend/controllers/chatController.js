/**
 * Chatbot & Live Agent Support Controller
 */
const db = require('../models/db');

exports.getChatStatus = (req, res) => {
    const status = db.readCollection('chat_status', {
        status: 'online',
        activeAgent: 'Support Specialist',
        lastUpdated: new Date().toISOString(),
        welcomeMessage: 'Hello! Welcome to Gtrend Tech Hub. How can our team assist you today?'
    });
    res.json({ success: true, data: status });
};

exports.updateChatStatus = (req, res) => {
    const { status, activeAgent, welcomeMessage } = req.body;
    const current = db.readCollection('chat_status', {});
    const updated = {
        ...current,
        status: status || current.status || 'online',
        activeAgent: activeAgent || current.activeAgent || 'Support Specialist',
        welcomeMessage: welcomeMessage || current.welcomeMessage,
        lastUpdated: new Date().toISOString()
    };
    db.writeCollection('chat_status', updated);
    res.json({ success: true, message: 'Agent status updated', data: updated });
};

exports.createChatSession = (req, res) => {
    const { customerName, customerEmail, initialMessage, track } = req.body;
    const sessionId = 'chat_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);

    const sessionData = {
        sessionId,
        customerName: customerName || 'Website Visitor',
        customerEmail: customerEmail || '',
        track: track || 'General Inquiry',
        status: 'waiting_for_agent', // 'bot' | 'waiting_for_agent' | 'active_agent' | 'resolved'
        assignedAgent: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
            {
                id: 'msg-1',
                sender: 'bot',
                senderName: 'Gtrend Assistant',
                text: 'Welcome to Gtrend Tech Hub! I have queued your conversation for our live support desk.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]
    };

    if (initialMessage) {
        sessionData.messages.push({
            id: 'msg-2',
            sender: 'customer',
            senderName: customerName || 'Visitor',
            text: initialMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }

    db.writeChatSession(sessionId, sessionData);
    res.status(201).json({ success: true, sessionId, data: sessionData });
};

exports.getAllChatSessions = (req, res) => {
    const sessions = db.listChatSessions();
    res.json({ success: true, count: sessions.length, data: sessions });
};

exports.getChatSessionById = (req, res) => {
    const session = db.readChatSession(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Chat session not found' });
    res.json({ success: true, data: session });
};

exports.sendMessage = (req, res) => {
    const { sessionId, sender, senderName, text } = req.body;
    if (!sessionId || !text) return res.status(400).json({ success: false, message: 'Session ID and message text are required' });

    const session = db.readChatSession(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const messageObj = {
        id: 'msg_' + Date.now().toString(36),
        sender: sender || 'customer',
        senderName: senderName || (sender === 'agent' ? 'Support Agent' : 'Visitor'),
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    session.messages.push(messageObj);
    session.updatedAt = new Date().toISOString();
    if (sender === 'agent' && session.status === 'waiting_for_agent') {
        session.status = 'active_agent';
        session.assignedAgent = senderName || 'Live Agent';
    }

    db.writeChatSession(sessionId, session);
    res.json({ success: true, message: messageObj, session });
};

exports.resolveChatSession = (req, res) => {
    const { sessionId } = req.body;
    const session = db.readChatSession(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.status = 'resolved';
    session.resolvedAt = new Date().toISOString();
    session.updatedAt = new Date().toISOString();
    session.messages.push({
        id: 'msg_' + Date.now().toString(36),
        sender: 'system',
        senderName: 'System',
        text: 'This support conversation has been marked as resolved. Thank you for connecting with Gtrend Tech Hub!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    db.writeChatSession(sessionId, session);
    res.json({ success: true, message: 'Chat session resolved', session });
};
