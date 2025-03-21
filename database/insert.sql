-- Chèn dữ liệu vào bảng Quyen (Quyền)
INSERT INTO Quyen (IdQuyen, TenQuyen) VALUES
(1, 'Thêm sản phẩm'),
(2, 'Sửa sản phẩm'),
(3, 'Xóa sản phẩm'),
(4, 'Thêm hóa đơn'),
(5, 'Sửa hóa đơn'),
(6, 'Xóa hóa đơn'),
(7, 'Thêm tài khoản'),
(8, 'Sửa tài khoản'),
(9, 'Xóa tài khoản'),
(10, 'Thêm khuyến mãi'),
(11, 'Sửa khuyến mãi'),
(12, 'Xóa khuyến mãi'),
(13, 'Thêm phiếu nhập'),
(14, 'Sửa phiếu nhập'),
(15, 'Xóa phiếu nhập');

-- Chèn dữ liệu vào bảng VaiTro (Vai trò)
INSERT INTO VaiTro (IdVaiTro, TenVaiTro, TrangThai) VALUES
(1, 'Người quản lý', TRUE),
(2, 'Nhập kho', TRUE),
(3, 'Người dùng', TRUE);

-- Chèn dữ liệu vào bảng CTQuyen (Chi tiết quyền)
INSERT INTO CTQuyen (IdQuyen, IdVaiTro) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), 
(7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), 
(13, 1), (14, 1), (15, 1),
(1, 2), (13, 2),
(4, 3), (5, 3);

-- Chèn dữ liệu vào bảng TaiKhoan (Tài khoản)
INSERT INTO TaiKhoan (IdTaiKhoan, TaiKhoan, MatKhau, TrangThai, IdVaiTro) VALUES
(1, 'quanly1', 'quanly123', TRUE, 1),
(2, 'nhapkho1', 'nhapkho123', TRUE, 2),
(3, 'nguoidung1', 'nguoidung123', TRUE, 3),
(4, 'nguoidung2', 'nguoidung456', TRUE, 3),
(5, 'nhapkho2', 'nhapkho456', TRUE, 2),
(6, 'quanly2', 'quanly456', TRUE, 1);

-- Chèn dữ liệu vào bảng NguoiDung (Người dùng)
INSERT INTO NguoiDung (IdNguoiDung, HoVaTen, Email, DiaChi, SoDienThoai, TrangThai) VALUES
(1, 'Nguyễn Văn Quản', 'nvq@gmail.com', 'Hà Nội', '0912345678', TRUE),
(2, 'Trần Thị Kho', 'ttk@gmail.com', 'TP.HCM', '0987654321', TRUE),
(3, 'Lê Văn Dùng', 'lvd@gmail.com', 'Đà Nẵng', '0935123456', TRUE),
(4, 'Phạm Thị Dùng', 'ptd@gmail.com', 'Hải Phòng', '0909123456', TRUE),
(5, 'Hoàng Văn Kho', 'hvk@gmail.com', 'Cần Thơ', '0923456789', TRUE);

-- Chèn dữ liệu vào bảng TinhTrangVanChuyen (Tình trạng vận chuyển)
INSERT INTO TinhTrangVanChuyen (IdTinhTrang, TenTinhTrang) VALUES
(1, 'Chờ xử lý'),
(2, 'Đang giao'),
(3, 'Đã giao'),
(4, 'Hủy'),
(5, 'Hoàn trả');

-- Chèn dữ liệu vào bảng HoaDon (Hóa đơn)
INSERT INTO HoaDon (IdHoaDon, IdTaiKhoan, NgayTao, ThanhTien, TrangThai, IdTinhTrang) VALUES
(1, 3, '2025-03-01', 15000000.00, TRUE, 1),
(2, 3, '2025-03-02', 20000000.00, TRUE, 2),
(3, 4, '2025-03-05', 30000000.00, TRUE, 3),
(4, 3, '2025-03-10', 10000000.00, TRUE, 4),
(5, 4, '2025-03-15', 25000000.00, TRUE, 5);

-- Chèn dữ liệu vào bảng ThuongHieu (Thương hiệu)
INSERT INTO ThuongHieu (IdThuongHieu, TenThuongHieu, TrangThai) VALUES
(1, 'Apple', TRUE),
(2, 'Samsung', TRUE),
(3, 'Xiaomi', TRUE),
(4, 'Oppo', TRUE),
(5, 'Vivo', TRUE);

-- Chèn dữ liệu vào bảng NhaCungCap (Nhà cung cấp)
INSERT INTO NhaCungCap (IdNCC, TenNCC, DiaChi, SoDienThoai, Email, TrangThai) VALUES
(1, 'Công ty TNHH A', 'Hà Nội', '0911111111', 'ctya@gmail.com', TRUE),
(2, 'Công ty TNHH B', 'TP.HCM', '0922222222', 'ctyb@gmail.com', TRUE),
(3, 'Công ty TNHH C', 'Đà Nẵng', '0933333333', 'ctyc@gmail.com', TRUE),
(4, 'Công ty TNHH D', 'Hải Phòng', '0944444444', 'ctyd@gmail.com', TRUE),
(5, 'Công ty TNHH E', 'Cần Thơ', '0955555555', 'ctye@gmail.com', TRUE);

-- Chèn dữ liệu vào bảng CauHinhSanPham (Cấu hình sản phẩm)
INSERT INTO CauHinhSanPham (IdCHSP, Ram, Rom, ManHinh, Pin, MauSac, Camera, TrangThai, IdNCC) VALUES
(1, '8GB', '128GB', '6.1 inch', '3000mAh', 'Đen', '12MP', TRUE, 1),
(2, '12GB', '256GB', '6.7 inch', '4000mAh', 'Trắng', '48MP', TRUE, 2),
(3, '6GB', '64GB', '6.5 inch', '5000mAh', 'Xanh', '13MP', TRUE, 3),
(4, '4GB', '32GB', '6.4 inch', '4500mAh', 'Đỏ', '16MP', TRUE, 4),
(5, '8GB', '128GB', '6.6 inch', '4200mAh', 'Vàng', '64MP', TRUE, 5);

-- Chèn dữ liệu vào bảng DongSanPham (Dòng sản phẩm)
INSERT INTO DongSanPham (IdDongSanPham, SoLuong, IdThuongHieu, TrangThai) VALUES
('IP7', 50, 1, TRUE),
('IP8', 30, 1, TRUE),
('SS10', 20, 2, TRUE),
('XM12', 40, 3, TRUE),
('OP5', 25, 4, TRUE);

-- Chèn dữ liệu vào bảng SanPham (Sản phẩm)
INSERT INTO SanPham (IdCHSP, IdDongSanPham, SoLuong) VALUES
(1, 'IP7', 50),
(2, 'IP8', 30),
(3, 'SS10', 20),
(4, 'XM12', 40),
(5, 'OP5', 25);

-- Chèn dữ liệu vào bảng Anh (Ảnh) - Để NULL cho cột Anh
INSERT INTO Anh (IdAnh, Anh, IdCHSP, IdDongSanPham) VALUES
(1, NULL, 1, 'IP7'),
(2, NULL, 2, 'IP8'),
(3, NULL, 3, 'SS10'),
(4, NULL, 4, 'XM12'),
(5, NULL, 5, 'OP5');

-- Chèn dữ liệu vào bảng BaoHanh (Bảo hành)
INSERT INTO BaoHanh (IdBaoHanh, ThoiGianBaoHanh, TrangThai) VALUES
(1, 12, TRUE),
(2, 24, TRUE),
(3, 6, TRUE),
(4, 18, TRUE),
(5, 12, TRUE);

-- Chèn dữ liệu vào bảng SanPhamChiTiet (Sản phẩm chi tiết) - IMEI là chuỗi 15 số ngẫu nhiên
INSERT INTO SanPhamChiTiet (Imei, TrangThai, IdCHSP, IdDongSanPham, IdBaoHanh) VALUES
('354128907563214', TRUE, 1, 'IP7', 1),
('867493021584930', TRUE, 2, 'IP8', 2),
('490154203237518', TRUE, 3, 'SS10', 3),
('352094108765432', TRUE, 4, 'XM12', 4),
('987654321098765', TRUE, 5, 'OP5', 5);

-- Chèn dữ liệu vào bảng KhuyenMai (Khuyến mãi)
INSERT INTO KhuyenMai (IdKhuyenMai, NgayBatDau, NgayKetThuc, PhanTramGiam, TrangThai) VALUES
(1, '2025-03-01', '2025-03-10', 10, TRUE),
(2, '2025-03-05', '2025-03-15', 15, TRUE),
(3, '2025-03-10', '2025-03-20', 20, TRUE),
(4, '2025-03-15', '2025-03-25', 25, TRUE),
(5, '2025-03-20', '2025-03-30', 30, TRUE);

-- Chèn dữ liệu vào bảng CTKhuyenMai (Chi tiết khuyến mãi)
INSERT INTO CTKhuyenMai (IdKhuyenMai, IdSanPham) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Chèn dữ liệu vào bảng GioHang (Giỏ hàng)
INSERT INTO GioHang (IdTaiKhoan, IdSanPham, SoLuong) VALUES
(3, 1, 2),
(3, 2, 1),
(4, 3, 3),
(4, 4, 1),
(3, 5, 2);

-- Chèn dữ liệu vào bảng PhieuNhap (Phiếu nhập)
INSERT INTO PhieuNhap (IdPhieuNhap, IdTaiKhoan, NgayNhap, TrangThai, IdNCC) VALUES
(1, 2, '2025-03-01', TRUE, 1),
(2, 2, '2025-03-02', TRUE, 2),
(3, 5, '2025-03-03', TRUE, 3),
(4, 2, '2025-03-04', TRUE, 4),
(5, 5, '2025-03-05', TRUE, 5);

-- Chèn dữ liệu vào bảng CTPhieuNhap (Chi tiết phiếu nhập)
INSERT INTO CTPhieuNhap (IdPhieuNhap, GiaNhap, SoLuong, IdCHSP, IdDongSanPham) VALUES
(1, 12000000.00, 10, 1, 'IP7'),
(2, 18000000.00, 5, 2, 'IP8'),
(3, 8000000.00, 15, 3, 'SS10'),
(4, 9000000.00, 8, 4, 'XM12'),
(5, 15000000.00, 6, 5, 'OP5');

-- Chèn dữ liệu vào bảng CTHoaDon (Chi tiết hóa đơn) - Sử dụng IMEI 15 số tương ứng
INSERT INTO CTHoaDon (IdHoaDon, GiaTien, SoLuong, Imei) VALUES
(1, 15000000.00, 1, '354128907563214'),
(2, 20000000.00, 1, '867493021584930'),
(3, 30000000.00, 2, '490154203237518'),
(4, 10000000.00, 1, '352094108765432'),
(5, 25000000.00, 1, '987654321098765');