# Hướng dẫn cấu hình Chatbot AI với OpenAI

## Yêu cầu

1. Tài khoản OpenAI với API key hợp lệ
2. Đã cài đặt package `openai` (đã được cài đặt tự động)

## Cấu hình

1. Tạo file `.env` trong thư mục `backend-app` (nếu chưa có)

2. Thêm các biến môi trường sau vào file `.env`:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
# Mặc định sử dụng GPT-4o-mini (rẻ hơn 60% so với GPT-3.5 Turbo)
# Các tùy chọn: gpt-4o-mini (khuyến nghị), gpt-3.5-turbo, gpt-4, gpt-4-turbo
OPENAI_MODEL=gpt-4o-mini
```

### Lấy OpenAI API Key:

1. Đăng nhập vào [OpenAI Platform](https://platform.openai.com/)
2. Vào phần "API Keys" trong menu
3. Tạo API key mới hoặc sử dụng key hiện có
4. Copy API key và dán vào file `.env`

### Model Options:

- `gpt-4o-mini` (mặc định, khuyến nghị) - Rẻ nhất, chất lượng tốt ($0.15/$0.60 per 1M tokens)
- `gpt-3.5-turbo` - Nhanh và tiết kiệm ($0.50/$1.50 per 1M tokens)
- `gpt-4` - Chất lượng cao hơn nhưng đắt hơn
- `gpt-4-turbo` - Phiên bản cải tiến của GPT-4

**Lưu ý về chi phí:**
- GPT-4o-mini rẻ hơn GPT-3.5 Turbo khoảng 60%
- Mỗi tin nhắn chatbot thường tốn ~$0.0001-0.0003
- 1,000 tin nhắn/ngày ≈ $0.10-0.30/ngày
- Có thể giới hạn số lượng requests để kiểm soát chi phí

## API Endpoints

### POST `/api/v1/chatbot/message`

Gửi một tin nhắn đơn đến chatbot.

**Request Body:**
```json
{
  "message": "Xin chào, bạn có thể giúp gì cho tôi?",
  "conversationHistory": [] // Tùy chọn
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Xin chào! Tôi là trợ lý AI...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/api/v1/chatbot/conversation`

Xử lý cuộc trò chuyện với nhiều tin nhắn.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Xin chào"
    },
    {
      "role": "assistant",
      "content": "Xin chào! Tôi có thể giúp gì cho bạn?"
    },
    {
      "role": "user",
      "content": "Bạn có sản phẩm whey protein không?"
    }
  ]
}
```

## Tính năng

- Chatbot được tích hợp sẵn vào frontend với giao diện đẹp mắt
- Hỗ trợ lịch sử cuộc trò chuyện
- Tự động cuộn đến tin nhắn mới nhất
- Hiển thị thời gian gửi tin nhắn
- Xử lý lỗi và hiển thị thông báo phù hợp

## Lưu ý

- API key phải được bảo mật và không commit vào Git
- Kiểm tra giới hạn sử dụng API của OpenAI để tránh chi phí phát sinh
- Model `gpt-4o-mini` được khuyến nghị vì rẻ hơn 60% so với GPT-3.5 Turbo
- Có thể thiết lập giới hạn chi phí hàng tháng trên OpenAI Dashboard
- Giám sát usage trong OpenAI Dashboard để kiểm soát chi phí
- Mỗi tin nhắn chatbot thường tốn rất ít (~$0.0001-0.0003), phù hợp cho production

