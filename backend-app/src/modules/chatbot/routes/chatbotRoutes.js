const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Route để gửi tin nhắn đơn
router.post('/message', chatbotController.sendMessage);

// Route để xử lý cuộc trò chuyện với lịch sử
router.post('/conversation', chatbotController.handleConversation);

module.exports = router;

