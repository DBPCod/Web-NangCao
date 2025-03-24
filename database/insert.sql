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
(1, 'Người quản lý', 1),
(2, 'Nhập kho', 1),
(3, 'Người dùng', 1);

-- Chèn dữ liệu vào bảng CTQuyen (Chi tiết quyền)
INSERT INTO CTQuyen (IdQuyen, IdVaiTro) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), 
(7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), 
(13, 1), (14, 1), (15, 1),
(1, 2), (13, 2),
(4, 3), (5, 3);

-- Chèn dữ liệu vào bảng TaiKhoan (Tài khoản)
INSERT INTO TaiKhoan (IdTaiKhoan, TaiKhoan, MatKhau, TrangThai, IdVaiTro) VALUES
(1, 'quanly1', 'quanly123', 1, 1),
(2, 'nhapkho1', 'nhapkho123', 1, 2),
(3, 'nguoidung1', 'nguoidung123', 1, 3),
(4, 'nguoidung2', 'nguoidung456', 1, 3),
(5, 'nhapkho2', 'nhapkho456', 1, 2),
(6, 'quanly2', 'quanly456', 0, 1);

-- Chèn dữ liệu vào bảng NguoiDung (Người dùng)
INSERT INTO NguoiDung (IdNguoiDung, HoVaTen, Email, DiaChi, SoDienThoai, TrangThai) VALUES
(1, 'Nguyễn Văn Quản', 'nvq@gmail.com', 'Hà Nội', '0912345678', 1),
(2, 'Trần Thị Kho', 'ttk@gmail.com', 'TP.HCM', '0987654321', 1),
(3, 'Lê Văn Dùng', 'lvd@gmail.com', 'Đà Nẵng', '0935123456', 1),
(4, 'Phạm Thị Dùng', 'ptd@gmail.com', 'Hải Phòng', '0909123456', 1),
(5, 'Hoàng Văn Kho', 'hvk@gmail.com', 'Cần Thơ', '0923456789', 0);

-- Chèn dữ liệu vào bảng TinhTrangVanChuyen (Tình trạng vận chuyển)
INSERT INTO TinhTrangVanChuyen (IdTinhTrang, TenTinhTrang) VALUES
(1, 'Chờ xử lý'),
(2, 'Đang giao'),
(3, 'Đã giao'),
(4, 'Hủy'),
(5, 'Hoàn trả');

-- Chèn dữ liệu vào bảng HoaDon (Hóa đơn)
INSERT INTO HoaDon (IdHoaDon, IdTaiKhoan, NgayTao, ThanhTien, TrangThai, IdTinhTrang) VALUES
(1, 3, '2025-03-01', 15000000.00, 1, 1),
(2, 3, '2025-03-02', 20000000.00, 1, 2),
(3, 4, '2025-03-05', 30000000.00, 1, 3),
(4, 3, '2025-03-10', 10000000.00, 0, 4),
(5, 4, '2025-03-15', 25000000.00, 1, 5);

-- Chèn dữ liệu vào bảng ThuongHieu (Thương hiệu)
INSERT INTO ThuongHieu (IdThuongHieu, TenThuongHieu, TrangThai) VALUES
(1, 'Apple', 1),
(2, 'Samsung', 1),
(3, 'Xiaomi', 1),
(4, 'Oppo', 1),
(5, 'Vivo', 0);

-- Chèn dữ liệu vào bảng NhaCungCap (Nhà cung cấp)
INSERT INTO NhaCungCap (IdNCC, TenNCC, DiaChi, SoDienThoai, Email, TrangThai) VALUES
(1, 'Công ty TNHH A', 'Hà Nội', '0911111111', 'ctya@gmail.com', 1),
(2, 'Công ty TNHH B', 'TP.HCM', '0922222222', 'ctyb@gmail.com', 1),
(3, 'Công ty TNHH C', 'Đà Nẵng', '0933333333', 'ctyc@gmail.com', 1),
(4, 'Công ty TNHH D', 'Hải Phòng', '0944444444', 'ctyd@gmail.com', 1),
(5, 'Công ty TNHH E', 'Cần Thơ', '0955555555', 'ctye@gmail.com', 0);

-- Chèn dữ liệu vào bảng CauHinhSanPham (Cấu hình sản phẩm)
INSERT INTO CauHinhSanPham (IdCHSP, Ram, Rom, ManHinh, Pin, MauSac, Camera, TrangThai) VALUES
(1, '8GB', '128GB', '6.1 inch', '3000mAh', 'Đen', '12MP', 1),
(2, '12GB', '256GB', '6.7 inch', '4000mAh', 'Trắng', '48MP', 1),
(3, '6GB', '64GB', '6.5 inch', '5000mAh', 'Xanh', '13MP', 1),
(4, '4GB', '32GB', '6.4 inch', '4500mAh', 'Đỏ', '16MP', 1),
(5, '8GB', '128GB', '6.6 inch', '4200mAh', 'Vàng', '64MP', 0);

-- Chèn dữ liệu vào bảng DongSanPham (Dòng sản phẩm)
INSERT INTO DongSanPham (IdDongSanPham, SoLuong, IdThuongHieu, TrangThai) VALUES
('IP7', 5, 1, 1),
('IP8', 4, 1, 1),
('SS10', 3, 2, 1),
('XM12', 2, 3, 1),
('OP5', 1, 4, 0);

-- Chèn dữ liệu vào bảng SanPham (Sản phẩm)
INSERT INTO SanPham (IdCHSP, IdDongSanPham, SoLuong, TrangThai) VALUES
(1, 'IP7', 5, 1),
(2, 'IP8', 4, 1),
(3, 'SS10', 3, 1),
(4, 'XM12', 2, 1),
(5, 'OP5', 1, 0);

-- Chèn dữ liệu vào bảng Anh (Ảnh)
INSERT INTO Anh (IdAnh, Anh, IdCHSP, IdDongSanPham, TrangThai) VALUES
(1, 'ip7_black.jpg', 1, 'IP7', 1),
(2, 'ip8_white.jpg', 2, 'IP8', 1),
(3, 'ss10_green.jpg', 3, 'SS10', 1),
(4, 'xm12_red.jpg', 4, 'XM12', 1),
(5, 'op5_gold.jpg', 5, 'OP5', 0);

-- Chèn dữ liệu vào bảng BaoHanh (Bảo hành)
INSERT INTO BaoHanh (IdBaoHanh, ThoiGianBaoHanh, TrangThai) VALUES
(1, 12, 1),
(2, 24, 1),
(3, 6, 1),
(4, 18, 1),
(5, 12, 0);

-- Chèn dữ liệu vào bảng SanPhamChiTiet (Sản phẩm chi tiết)
-- Tạo đầy đủ số lượng bản ghi dựa trên SoLuong từ bảng SanPham
INSERT INTO SanPhamChiTiet (Imei, TrangThai, IdCHSP, IdDongSanPham, IdBaoHanh) VALUES
-- Cho (1, 'IP7', 5, 1) -> 5 bản ghi
('354128907563201', 1, 1, 'IP7', 1),
('354128907563202', 1, 1, 'IP7', 1),
('354128907563203', 1, 1, 'IP7', 1),
('354128907563204', 1, 1, 'IP7', 1),
('354128907563205', 1, 1, 'IP7', 1),
-- Cho (2, 'IP8', 4, 1) -> 4 bản ghi
('867493021584901', 1, 2, 'IP8', 2),
('867493021584902', 1, 2, 'IP8', 2),
('867493021584903', 1, 2, 'IP8', 2),
('867493021584904', 1, 2, 'IP8', 2),
-- Cho (3, 'SS10', 3, 1) -> 3 bản ghi
('490154203237501', 1, 3, 'SS10', 3),
('490154203237502', 1, 3, 'SS10', 3),
('490154203237503', 1, 3, 'SS10', 3),
-- Cho (4, 'XM12', 2, 1) -> 2 bản ghi
('352094108765401', 1, 4, 'XM12', 4),
('352094108765402', 1, 4, 'XM12', 4),
-- Cho (5, 'OP5', 1, 0) -> 1 bản ghi
('987654321098701', 0, 5, 'OP5', 5);

-- Chèn dữ liệu vào bảng KhuyenMai (Khuyến mãi)
INSERT INTO KhuyenMai (IdKhuyenMai, NgayBatDau, NgayKetThuc, PhanTramGiam, TrangThai) VALUES
(1, '2025-03-01', '2025-03-10', 10, 1),
(2, '2025-03-05', '2025-03-15', 15, 1),
(3, '2025-03-10', '2025-03-20', 20, 1),
(4, '2025-03-15', '2025-03-25', 25, 1),
(5, '2025-03-20', '2025-03-30', 30, 0);

-- Chèn dữ liệu vào bảng CTKhuyenMai (Chi tiết khuyến mãi)
INSERT INTO CTKhuyenMai (IdKhuyenMai, IdCHSP, IdDongSanPham) VALUES
(1, 1, 'IP7'),
(2, 2, 'IP8'),
(3, 3, 'SS10'),
(4, 4, 'XM12'),
(5, 5, 'OP5');


-- Chèn dữ liệu vào bảng PhieuNhap (Phiếu nhập)
INSERT INTO PhieuNhap (IdPhieuNhap, IdTaiKhoan, NgayNhap, TrangThai, IdNCC) VALUES
(1, 2, '2025-03-01', 1, 1),
(2, 2, '2025-03-02', 1, 2),
(3, 5, '2025-03-03', 1, 3),
(4, 2, '2025-03-04', 1, 4),
(5, 5, '2025-03-05', 0, 5);

-- Chèn dữ liệu vào bảng CTPhieuNhap (Chi tiết phiếu nhập)
INSERT INTO CTPhieuNhap (IdPhieuNhap, GiaNhap, SoLuong, IdCHSP, IdDongSanPham) VALUES
(1, 12000000.00, 5, 1, 'IP7'),
(2, 18000000.00, 4, 2, 'IP8'),
(3, 8000000.00, 3, 3, 'SS10'),
(4, 9000000.00, 2, 4, 'XM12'),
(5, 15000000.00, 1, 5, 'OP5');

-- Chèn dữ liệu vào bảng CTHoaDon (Chi tiết hóa đơn)
INSERT INTO CTHoaDon (IdHoaDon, GiaTien, SoLuong, Imei) VALUES
(1, 15000000.00, 1, '354128907563201'),
(2, 20000000.00, 1, '867493021584901'),
(3, 30000000.00, 2, '490154203237501'),
(4, 10000000.00, 1, '352094108765401'),
(5, 25000000.00, 1, '987654321098701');