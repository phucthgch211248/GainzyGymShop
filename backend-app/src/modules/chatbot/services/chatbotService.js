const OpenAI = require('openai');

// Hàm khởi tạo OpenAI client một cách lazy (chỉ khi cần)
let openai = null;

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY chưa được cấu hình trong file .env');
    }
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

const ChatbotService = {
  /**
   * Gửi tin nhắn đến OpenAI và nhận phản hồi
   * @param {string} message - Tin nhắn từ người dùng
   * @param {Array} conversationHistory - Lịch sử cuộc trò chuyện (tùy chọn)
   * @returns {Promise<string>} - Phản hồi từ AI
   */
  sendMessage: async (message, conversationHistory = []) => {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Tin nhắn không được để trống');
    }

    // Kiểm tra và khởi tạo OpenAI client
    const client = getOpenAIClient();

    try {
      // Tạo system prompt để chatbot hoạt động như một trợ lý bán hàng cho cửa hàng thể hình
      const systemPrompt = `Bạn là một trợ lý AI thân thiện và chuyên nghiệp của cửa hàng bán thực phẩm bổ sung thể hình và dụng cụ tập gym. 
Nhiệm vụ của bạn là:
- Trả lời các câu hỏi về sản phẩm, thương hiệu, và dịch vụ của cửa hàng
- Tư vấn về các sản phẩm phù hợp với nhu cầu của khách hàng
- Hướng dẫn về cách sử dụng sản phẩm
- Giải đáp thắc mắc về đơn hàng, vận chuyển, thanh toán
- Đưa ra lời khuyên về dinh dưỡng và tập luyện thể hình (nếu được hỏi)

Hãy trả lời một cách ngắn gọn, rõ ràng và thân thiện bằng tiếng Việt. Nếu không chắc chắn về thông tin, hãy đề nghị khách hàng liên hệ trực tiếp với cửa hàng.`;

      // Xây dựng messages array
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message.trim() }
      ];

      // Gọi API OpenAI
      // Mặc định sử dụng GPT-4o-mini (rẻ hơn 60% so với GPT-3.5 Turbo)
      // Có thể thay đổi trong .env: OPENAI_MODEL=gpt-3.5-turbo hoặc gpt-4o-mini
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      return response;
    } catch (error) {
      // Xử lý lỗi từ OpenAI API
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          throw new Error('API key không hợp lệ');
        } else if (error.status === 429) {
          throw new Error('Đã vượt quá giới hạn API, vui lòng thử lại sau');
        } else if (error.status === 500) {
          throw new Error('Lỗi server OpenAI, vui lòng thử lại sau');
        }
      }
      
      throw new Error(error.message || 'Có lỗi xảy ra khi gửi tin nhắn');
    }
  },

  /**
   * Xử lý cuộc trò chuyện với lịch sử
   * @param {Array} messages - Mảng các tin nhắn trong cuộc trò chuyện
   * @returns {Promise<string>} - Phản hồi từ AI
   */
  handleConversation: async (messages) => {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Danh sách tin nhắn không hợp lệ');
    }

    // Lấy tin nhắn cuối cùng
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || !lastMessage.content) {
      throw new Error('Tin nhắn không hợp lệ');
    }

    // Chuyển đổi format messages để phù hợp với OpenAI
    const conversationHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    return await ChatbotService.sendMessage(lastMessage.content, conversationHistory);
  }
};

module.exports = ChatbotService;

