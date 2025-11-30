# Hướng dẫn cấu hình Google OAuth

## Bước 1: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Nếu chưa có, cấu hình OAuth consent screen:
   - Chọn **External** (hoặc Internal nếu dùng Google Workspace)
   - Điền thông tin: App name, User support email, Developer contact
   - Thêm scopes: `email`, `profile`, `openid`
   - Thêm test users (nếu ở chế độ Testing)
6. Tạo OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: `Gainzy Web Client`
   - **Authorized JavaScript origins** (QUAN TRỌNG - phải có):
     - `http://localhost:5173` (development - không có dấu `/` ở cuối!)
     - `http://127.0.0.1:5173` (nếu dùng IP thay vì localhost)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs** (tùy chọn cho Sign-In button, nhưng nên thêm):
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - **Lưu ý:** Không có dấu `/` ở cuối các URL!
7. Click **Create** và copy **Client ID** (không cần Client Secret cho frontend)

## Bước 2: Cấu hình Backend

Thêm vào file `.env` của backend:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Bước 3: Cấu hình Frontend

Thêm vào file `.env` hoặc `.env.local` của frontend (trong thư mục `gainzy/`):

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Lưu ý:** Frontend chỉ cần Client ID, không cần Client Secret.

## Bước 4: Khởi động lại ứng dụng

1. Restart backend server
2. Restart frontend dev server
3. Truy cập trang login và bạn sẽ thấy nút "Đăng nhập bằng Google"

## Kiểm tra

1. Mở trang login (`/login`)
2. Bạn sẽ thấy nút Google Sign In bên dưới form đăng nhập
3. Click vào nút và chọn tài khoản Google
4. Sau khi xác thực thành công, bạn sẽ được đăng nhập tự động

## Lưu ý quan trọng

- **Client Secret** chỉ dùng ở backend, không bao giờ expose ra frontend
- Đảm bảo Authorized JavaScript origins và redirect URIs khớp với domain của bạn
- Nếu ở chế độ Testing, chỉ những email trong danh sách test users mới đăng nhập được
- Để public, cần submit OAuth consent screen để Google review

## Troubleshooting

### Lỗi "Error 401: invalid_client" hoặc "The OAuth client was not found"
**Đây là lỗi phổ biến nhất!** Các nguyên nhân và cách khắc phục:

1. **Client ID không đúng hoặc chưa được copy đúng:**
   - Kiểm tra lại file `.env` trong thư mục `gainzy/`
   - Đảm bảo `VITE_GOOGLE_CLIENT_ID` có giá trị đúng (không có khoảng trắng thừa)
   - Format đúng: `VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Quan trọng:** Restart dev server sau khi sửa file `.env`!

2. **Authorized JavaScript origins chưa được cấu hình đúng:**
   - Vào [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
   - Click vào OAuth 2.0 Client ID của bạn
   - Trong phần "Authorized JavaScript origins", đảm bảo có:
     - `http://localhost:5173` (nếu đang chạy local)
     - `http://127.0.0.1:5173` (nếu dùng IP)
   - **Lưu ý:** Không có dấu `/` ở cuối URL!
   - Click "Save" sau khi thêm

3. **Client ID chưa được kích hoạt:**
   - Kiểm tra trong Google Cloud Console xem Client ID có status "Enabled" không
   - Nếu bị disabled, click "Enable"

4. **OAuth consent screen chưa được cấu hình:**
   - Vào APIs & Services > OAuth consent screen
   - Đảm bảo đã điền đầy đủ thông tin (App name, Support email, Developer contact)
   - Nếu ở chế độ Testing, thêm email của bạn vào "Test users"

5. **Kiểm tra trong Browser Console:**
   - Mở Developer Tools (F12)
   - Vào tab Console
   - Xem có lỗi gì không
   - Kiểm tra Network tab xem request đến Google có thành công không

### Lỗi "redirect_uri_mismatch"
- Kiểm tra Authorized redirect URIs trong Google Cloud Console
- Đảm bảo URL khớp chính xác (bao gồm http/https và port)
- **Quan trọng:** Với Google Sign-In button, không cần redirect URI, nhưng vẫn cần JavaScript origins

### Nút Google không hiển thị
- Kiểm tra VITE_GOOGLE_CLIENT_ID trong .env của frontend
- Kiểm tra console browser có lỗi không
- Đảm bảo script Google đã load (kiểm tra Network tab)
- Đảm bảo đã restart dev server sau khi thêm env variable

### Các bước kiểm tra nhanh:
1. ✅ File `.env` có tồn tại trong thư mục `gainzy/`?
2. ✅ `VITE_GOOGLE_CLIENT_ID` có giá trị (không phải `your-google-client-id-here`)?
3. ✅ Đã restart dev server sau khi thêm/sửa `.env`?
4. ✅ Authorized JavaScript origins có `http://localhost:5173`?
5. ✅ OAuth consent screen đã được cấu hình?
6. ✅ Client ID status là "Enabled"?

