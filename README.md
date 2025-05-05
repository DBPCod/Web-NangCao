# SmartStation - Website Bán Điện Thoại

SmartStation là một website bán điện thoại di động với đầy đủ chức năng quản lý sản phẩm, đơn hàng, khách hàng và thống kê doanh thu.

## Tính năng chính

- **Giao diện người dùng**: Hiển thị sản phẩm, tìm kiếm, lọc theo thương hiệu, giá
- **Giỏ hàng và thanh toán**: Quản lý giỏ hàng, đặt hàng
- **Quản lý tài khoản**: Đăng ký, đăng nhập, xem lịch sử đơn hàng
- **Trang quản trị (Admin)**: Quản lý sản phẩm, đơn hàng, khách hàng, thống kê doanh thu

## Yêu cầu hệ thống

- XAMPP (PHP 8.0+, MySQL)
- Trình duyệt web hiện đại (Chrome, Firefox, Edge)

## Hướng dẫn cài đặt

1. **Cài đặt XAMPP**
   - Tải và cài đặt XAMPP từ [trang chủ](https://www.apachefriends.org/download.html)
   - Khởi động Apache và MySQL từ XAMPP Control Panel

2. **Cài đặt mã nguồn**
   - Clone hoặc tải repository này
     ```
     git clone https://github.com/DBPCod/Web-NangCao.git
     ``` 
   - Đảm bảo vị trí thư mục `smartstation` ở thư mục `htdocs` của XAMPP (thường là `C:\xampp\htdocs\` trên Windows)

3. **Cài đặt cơ sở dữ liệu**
   - Mở trình duyệt và truy cập http://localhost/phpmyadmin
   - Tạo database mới với tên `ss`
   - Import file `ss.sql` từ thư mục `database` của dự án

4. **Truy cập website**
   - Trang người dùng: http://localhost/smartstation/src/mvc/views/user/
   - Trang quản trị: http://localhost/smartstation/src/mvc/views/admin/
   - Tài khoản admin mặc định: 
     - Tên đăng nhập: admin
     - Mật khẩu: 12345678

## Cấu trúc thư mục

```
smartstation/
├── database/           # Chứa file SQL cơ sở dữ liệu
├── src/
│   ├── mvc/            # Mô hình MVC
│   │   ├── controllers/ # Các controller
│   │   ├── core/        # Core của ứng dụng
│   │   ├── models/      # Các model tương tác với CSDL
│   │   └── views/       # Giao diện người dùng
│   └── public/          # Tài nguyên công khai (CSS, JS, hình ảnh)
└── README.md           # Tài liệu hướng dẫn
```

## Thành viên nhóm

| STT | MSSV | Họ và tên | Email |
|-----|------|-----------|-------|
| 1   |   3122410227   | Đoàn Phong Lưu           |   doanphongluu082@gmail.com    |
| 2   |   3122410188   | Vũ Đăng Khoa           |   khoavu1831@gmail.com   |
| 3   |   3122410305   | Đinh Bá Phong           |   dinhbaphong123@gmail.com    |
| 1   |   3123410222   | Nguyễn Tuấn Minh          |   ntminh16039999@gmail.com   |



