# Deployment Guide - Vercel

Hướng dẫn deploy dự án Gym Shop lên Vercel.

## 📋 Tổng quan

Dự án bao gồm:
- **Frontend**: React + Vite (deploy trên Vercel)
- **Backend**: Express.js + MongoDB (có thể deploy trên Vercel hoặc Render/Railway)

## 🚀 Option 1: Deploy Frontend trên Vercel, Backend trên Render/Railway (Khuyến nghị)

### Frontend (Vercel)

1. **Cài đặt Vercel CLI** (nếu chưa có):
```bash
npm i -g vercel
```

2. **Deploy frontend**:
```bash
cd gainzy
vercel
```

3. **Cấu hình Environment Variables** trong Vercel Dashboard:
   - `VITE_API_BASE_URL`: URL của backend API (ví dụ: `https://your-backend.onrender.com`)

4. **Build Settings** (tự động detect từ `vercel.json`):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Backend (Render/Railway - Khuyến nghị)

Vì Vercel serverless functions có timeout limit, nên deploy backend trên Render hoặc Railway sẽ tốt hơn.

#### Render.com:
1. Tạo account trên [Render.com](https://render.com)
2. Tạo new Web Service
3. Connect GitHub repository
4. Cấu hình:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Thêm Environment Variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key cho JWT
   - `PORT`: 5000 (hoặc để Render tự động)
   - `NODE_ENV`: production
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary config
   - `CLOUDINARY_API_KEY`: Cloudinary config
   - `CLOUDINARY_API_SECRET`: Cloudinary config

#### Railway.app:
1. Tạo account trên [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Chọn repository và branch
4. Railway tự động detect Node.js
5. Thêm Environment Variables tương tự như Render

## 🚀 Option 2: Deploy cả Frontend và Backend trên Vercel

### Frontend (Vercel)

1. Deploy như Option 1

### Backend (Vercel Serverless)

1. **Deploy backend**:
```bash
cd backend-app
vercel
```

2. **Cấu hình Environment Variables** trong Vercel Dashboard:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key cho JWT
   - `NODE_ENV`: production
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary config
   - `CLOUDINARY_API_KEY`: Cloudinary config
   - `CLOUDINARY_API_SECRET`: Cloudinary config

3. **Lưu ý**: 
   - Vercel serverless functions có timeout 10s (Hobby) hoặc 60s (Pro)
   - Nếu có operations dài, nên dùng Option 1

## 📝 Environment Variables Checklist

### Frontend (.env hoặc Vercel Dashboard):
```
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (.env hoặc Render/Railway/Vercel Dashboard):
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🔧 Cập nhật CORS trong Backend

Sau khi deploy, cập nhật CORS trong `backend-app/src/app.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-frontend.vercel.app',  // Thêm domain Vercel của bạn
    'https://your-custom-domain.com'      // Nếu có custom domain
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 📦 Build Commands

### Frontend:
```bash
cd gainzy
npm install
npm run build
```

### Backend:
```bash
cd backend-app
npm install
npm start
```

## 🔍 Kiểm tra Deployment

1. **Frontend**: Truy cập URL Vercel (ví dụ: `https://your-app.vercel.app`)
2. **Backend**: Kiểm tra health check endpoint:
   - `https://your-backend-url.com/health`
   - Hoặc `https://your-backend.vercel.app/api/health`

## 🐛 Troubleshooting

### Frontend không kết nối được Backend:
- Kiểm tra `VITE_API_BASE_URL` trong Vercel environment variables
- Kiểm tra CORS settings trong backend
- Kiểm tra network tab trong browser console

### Backend lỗi trên Vercel:
- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo tất cả environment variables đã được set
- Kiểm tra MongoDB connection string
- Nếu timeout, xem xét deploy backend trên Render/Railway

### Build failed:
- Kiểm tra Node.js version (Vercel hỗ trợ Node 18+)
- Kiểm tra dependencies trong package.json
- Xem build logs trong Vercel Dashboard

## 📚 Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)

