const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/status', chatController.getChatStatus);
router.post('/status', chatController.updateChatStatus);
router.post('/session', chatController.createChatSession);
router.get('/sessions', chatController.getAllChatSessions);
router.get('/session/:id', chatController.getChatSessionById);
router.post('/message', chatController.sendMessage);
router.post('/resolve', chatController.resolveChatSession);

module.exports = router;
