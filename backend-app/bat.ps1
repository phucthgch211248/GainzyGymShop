# Cấu trúc thư mục chính
New-Item -ItemType Directory -Path "src"
New-Item -ItemType Directory -Path "src/config"
New-Item -ItemType Directory -Path "src/middleware"
New-Item -ItemType Directory -Path "src/utils"
New-Item -ItemType Directory -Path "src/constants"

# Authentication
New-Item -ItemType Directory -Path "src/modules/auth"
New-Item -ItemType Directory -Path "src/modules/auth/controllers"
New-Item -ItemType Directory -Path "src/modules/auth/services"
New-Item -ItemType Directory -Path "src/modules/auth/routes"
New-Item -ItemType Directory -Path "src/modules/auth/validators"

# User Module
New-Item -ItemType Directory -Path "src/modules/user"
New-Item -ItemType Directory -Path "src/modules/user/controllers"
New-Item -ItemType Directory -Path "src/modules/user/services"
New-Item -ItemType Directory -Path "src/modules/user/routes"
New-Item -ItemType Directory -Path "src/modules/user/models"
New-Item -ItemType Directory -Path "src/modules/user/validators"

# Product Module
New-Item -ItemType Directory -Path "src/modules/product"
New-Item -ItemType Directory -Path "src/modules/product/controllers"
New-Item -ItemType Directory -Path "src/modules/product/services"
New-Item -ItemType Directory -Path "src/modules/product/routes"
New-Item -ItemType Directory -Path "src/modules/product/models"
New-Item -ItemType Directory -Path "src/modules/product/validators"

# Category Module
New-Item -ItemType Directory -Path "src/modules/category"
New-Item -ItemType Directory -Path "src/modules/category/controllers"
New-Item -ItemType Directory -Path "src/modules/category/services"
New-Item -ItemType Directory -Path "src/modules/category/routes"
New-Item -ItemType Directory -Path "src/modules/category/models"
New-Item -ItemType Directory -Path "src/modules/category/validators"

# Cart Module
New-Item -ItemType Directory -Path "src/modules/cart"
New-Item -ItemType Directory -Path "src/modules/cart/controllers"
New-Item -ItemType Directory -Path "src/modules/cart/services"
New-Item -ItemType Directory -Path "src/modules/cart/routes"
New-Item -ItemType Directory -Path "src/modules/cart/models"
New-Item -ItemType Directory -Path "src/modules/cart/validators"

# Order Module
New-Item -ItemType Directory -Path "src/modules/order"
New-Item -ItemType Directory -Path "src/modules/order/controllers"
New-Item -ItemType Directory -Path "src/modules/order/services"
New-Item -ItemType Directory -Path "src/modules/order/routes"
New-Item -ItemType Directory -Path "src/modules/order/models"
New-Item -ItemType Directory -Path "src/modules/order/validators"

# Review Module
New-Item -ItemType Directory -Path "src/modules/review"
New-Item -ItemType Directory -Path "src/modules/review/controllers"
New-Item -ItemType Directory -Path "src/modules/review/services"
New-Item -ItemType Directory -Path "src/modules/review/routes"
New-Item -ItemType Directory -Path "src/modules/review/models"
New-Item -ItemType Directory -Path "src/modules/review/validators"

# Admin Dashboard Module
New-Item -ItemType Directory -Path "src/modules/admin"
New-Item -ItemType Directory -Path "src/modules/admin/controllers"
New-Item -ItemType Directory -Path "src/modules/admin/services"
New-Item -ItemType Directory -Path "src/modules/admin/routes"
New-Item -ItemType Directory -Path "src/modules/admin/validators"

# Uploads và Static Files
New-Item -ItemType Directory -Path "uploads"
New-Item -ItemType Directory -Path "uploads/products"
New-Item -ItemType Directory -Path "uploads/avatars"
New-Item -ItemType Directory -Path "uploads/categories"

# Logs
New-Item -ItemType Directory -Path "logs"

# Tests
New-Item -ItemType Directory -Path "tests"
New-Item -ItemType Directory -Path "tests/unit"
New-Item -ItemType Directory -Path "tests/integration"

# Documentation
New-Item -ItemType Directory -Path "docs"

# Tạo các file cấu hình cơ bản
New-Item -ItemType File -Path ".env.example"
New-Item -ItemType File -Path ".gitignore"
New-Item -ItemType File -Path "package.json"
New-Item -ItemType File -Path "README.md"
New-Item -ItemType File -Path "src/app.js"
New-Item -ItemType File -Path "src/server.js"

Write-Host "Đã tạo xong cấu trúc thư mục dự án!" -ForegroundColor Green