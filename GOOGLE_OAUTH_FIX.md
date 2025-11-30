# Hướng dẫn khắc phục lỗi "The OAuth client was not found"

## Nguyên nhân
Lỗi này xảy ra khi Google không tìm thấy Client ID trong hệ thống của họ. Thường do:
- Client ID bị xóa hoặc không tồn tại
- Client ID thuộc project khác
- Client ID chưa được tạo đúng cách

## Giải pháp: Tạo lại Client ID từ đầu

### Bước 1: Xóa Client ID cũ (nếu có)
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn đúng project của bạn
3. Vào **APIs & Services** > **Credentials**
4. Tìm OAuth 2.0 Client ID cũ (nếu có)
5. Click vào và xóa nó

### Bước 2: Cấu hình OAuth Consent Screen (QUAN TRỌNG - phải làm trước)
1. Vào **APIs & Services** > **OAuth consent screen**
2. Chọn **External** (hoặc Internal nếu dùng Google Workspace)
3. Click **CREATE**
4. Điền thông tin bắt buộc:
   - **App name**: `Gainzy` (hoặc tên bạn muốn)
   - **User support email**: Email của bạn
   - **Developer contact information**: Email của bạn
5. Click **SAVE AND CONTINUE**
6. Ở màn hình **Scopes**, click **ADD OR REMOVE SCOPES**
   - Chọn: `email`, `profile`, `openid`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**
7. Ở màn hình **Test users** (nếu ở chế độ Testing):
   - Click **ADD USERS**
   - Thêm email của bạn: `phucthgch211248@fpt.edu.vn`
   - Click **ADD**
   - Click **SAVE AND CONTINUE**
8. Ở màn hình **Summary**, click **BACK TO DASHBOARD**

### Bước 3: Tạo OAuth 2.0 Client ID mới
1. Vào **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Nếu chưa cấu hình OAuth consent screen, bạn sẽ được yêu cầu cấu hình (làm Bước 2 trước)
4. Chọn **Application type**: **Web application**
5. Đặt **Name**: `Gainzy Web Client`
6. **Authorized JavaScript origins** - Click **+ ADD URI** và thêm:
   ```
   http://localhost:5173
   ```
   **LƯU Ý QUAN TRỌNG:**
   - Không có dấu `/` ở cuối
   - Phải là `http://` không phải `https://` (cho localhost)
   - Port phải đúng (5173 là port mặc định của Vite)
7. **Authorized redirect URIs** - Click **+ ADD URI** và thêm:
   ```
   http://localhost:5173
   ```
   (Cũng không có dấu `/` ở cuối)
8. Click **CREATE**
9. **Copy Client ID** (không cần Client Secret cho frontend)
   - Format sẽ giống: `123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

### Bước 4: Cập nhật file .env
1. Mở file `gainzy/.env`
2. Thay thế giá trị `VITE_GOOGLE_CLIENT_ID` bằng Client ID mới vừa copy:
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```
3. **Lưu file**

### Bước 5: Restart Dev Server
1. Dừng dev server (nhấn `Ctrl+C` trong terminal)
2. Chạy lại:
   ```bash
   cd gainzy
   npm run dev
   ```
3. **QUAN TRỌNG:** Vite chỉ đọc file `.env` khi khởi động, nên phải restart!

### Bước 6: Kiểm tra
1. Mở trình duyệt và vào `http://localhost:5173/login`
2. Bạn sẽ thấy nút "Sign in with Google"
3. Click vào nút và chọn tài khoản Google
4. Nếu vẫn lỗi, kiểm tra lại các bước trên

## Checklist kiểm tra

Trước khi test, đảm bảo:
- [ ] OAuth consent screen đã được cấu hình hoàn chỉnh
- [ ] Test user đã được thêm (nếu ở chế độ Testing)
- [ ] OAuth 2.0 Client ID đã được tạo
- [ ] Authorized JavaScript origins có `http://localhost:5173` (không có `/` ở cuối)
- [ ] Authorized redirect URIs có `http://localhost:5173` (không có `/` ở cuối)
- [ ] File `gainzy/.env` có `VITE_GOOGLE_CLIENT_ID` với giá trị đúng
- [ ] Đã restart dev server sau khi sửa `.env`

## Lưu ý quan trọng

1. **Không có dấu `/` ở cuối URL** trong Authorized JavaScript origins và redirect URIs
2. **Phải restart dev server** sau khi sửa file `.env`
3. **OAuth consent screen phải được cấu hình trước** khi tạo Client ID
4. **Nếu ở chế độ Testing**, email của bạn phải được thêm vào Test users
5. **Client ID phải thuộc đúng project** trong Google Cloud Console

## Nếu vẫn lỗi

1. Kiểm tra Browser Console (F12) xem có lỗi gì không
2. Kiểm tra Network tab xem request đến Google có thành công không
3. Đảm bảo bạn đang dùng đúng Google account có quyền truy cập project
4. Thử tạo project mới trong Google Cloud Console và tạo Client ID mới

