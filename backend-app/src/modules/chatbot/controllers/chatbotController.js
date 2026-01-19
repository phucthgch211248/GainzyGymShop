const ChatbotService = require('../services/chatbotService');

const ChatbotController = {
  /**
   * Xử lý tin nhắn từ người dùng
   * POST /api/v1/chatbot/message
   */
  sendMessage: async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Tin nhắn không được để trống'
        });
      }

      const response = await ChatbotService.sendMessage(message, conversationHistory);

      res.json({
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi xử lý tin nhắn'
      });
    }
  },

  /**
   * Xử lý cuộc trò chuyện với nhiều tin nhắn
   * POST /api/v1/chatbot/conversation
   */
  handleConversation: async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Danh sách tin nhắn không hợp lệ'
        });
      }

      const response = await ChatbotService.handleConversation(messages);

      res.json({
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi xử lý cuộc trò chuyện'
      });
    }
  }
};

module.exports = ChatbotController;

