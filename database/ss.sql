-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 04, 2025 lúc 05:27 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ss`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `anh`
--

CREATE TABLE `anh` (
  `IdAnh` int(11) NOT NULL,
  `Anh` varchar(255) DEFAULT NULL,
  `IdCHSP` int(11) DEFAULT NULL,
  `IdDongSanPham` varchar(20) DEFAULT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `anh`
--

INSERT INTO `anh` (`IdAnh`, `Anh`, `IdCHSP`, `IdDongSanPham`, `TrangThai`) VALUES
(1, 'ip7_black.jpg', 1, 'IP7', 1),
(2, 'ip8_white.jpg', 2, 'IP8', 1),
(3, 'ss10_green.jpg', 3, 'SS10', 1),
(4, 'xm12_red.jpg', 4, 'XM12', 1),
(5, 'op5_gold.jpg', 5, 'OP5', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baohanh`
--

CREATE TABLE `baohanh` (
  `IdBaoHanh` int(11) NOT NULL,
  `ThoiGianBaoHanh` int(11) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `baohanh`
--

INSERT INTO `baohanh` (`IdBaoHanh`, `ThoiGianBaoHanh`, `TrangThai`) VALUES
(1, 12, 1),
(2, 24, 1),
(3, 6, 1),
(4, 18, 1),
(5, 12, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cauhinhsanpham`
--

CREATE TABLE `cauhinhsanpham` (
  `IdCHSP` int(11) NOT NULL,
  `Ram` varchar(20) DEFAULT NULL,
  `Rom` varchar(20) DEFAULT NULL,
  `ManHinh` varchar(50) DEFAULT NULL,
  `Pin` varchar(20) DEFAULT NULL,
  `MauSac` varchar(50) DEFAULT NULL,
  `Camera` varchar(50) DEFAULT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cauhinhsanpham`
--

INSERT INTO `cauhinhsanpham` (`IdCHSP`, `Ram`, `Rom`, `ManHinh`, `Pin`, `MauSac`, `Camera`, `TrangThai`) VALUES
(1, '8GB', '128GB', '6.1 inch', '3000mAh', 'Đen', '12MP', 1),
(2, '12GB', '256GB', '6.7 inch', '4000mAh', 'Trắng', '48MP', 1),
(3, '6GB', '64GB', '6.5 inch', '5000mAh', 'Xanh', '13MP', 1),
(4, '4GB', '32GB', '6.4 inch', '4500mAh', 'Đỏ', '16MP', 1),
(5, '8GB', '128GB', '6.6 inch', '4200mAh', 'Vàng', '64MP', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cthoadon`
--

CREATE TABLE `cthoadon` (
  `IdHoaDon` int(11) NOT NULL,
  `GiaTien` decimal(15,2) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `Imei` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cthoadon`
--

INSERT INTO `cthoadon` (`IdHoaDon`, `GiaTien`, `SoLuong`, `Imei`) VALUES
(1, 15000000.00, 1, '354128907563201'),
(2, 20000000.00, 1, '867493021584901'),
(3, 30000000.00, 2, '490154203237501'),
(4, 10000000.00, 1, '352094108765401'),
(5, 25000000.00, 1, '987654321098701');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ctkhuyenmai`
--

CREATE TABLE `ctkhuyenmai` (
  `IdKhuyenMai` int(11) NOT NULL,
  `IdCHSP` int(11) NOT NULL,
  `IdDongSanPham` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ctkhuyenmai`
--

INSERT INTO `ctkhuyenmai` (`IdKhuyenMai`, `IdCHSP`, `IdDongSanPham`) VALUES
(1, 1, 'IP7'),
(2, 2, 'IP8'),
(3, 3, 'SS10'),
(4, 4, 'XM12'),
(5, 5, 'OP5');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ctphieunhap`
--

CREATE TABLE `ctphieunhap` (
  `IdPhieuNhap` int(11) NOT NULL,
  `GiaNhap` decimal(15,2) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `IdCHSP` int(11) NOT NULL,
  `IdDongSanPham` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ctphieunhap`
--

INSERT INTO `ctphieunhap` (`IdPhieuNhap`, `GiaNhap`, `SoLuong`, `IdCHSP`, `IdDongSanPham`) VALUES
(1, 12000000.00, 5, 1, 'IP7'),
(2, 18000000.00, 4, 2, 'IP8'),
(3, 8000000.00, 3, 3, 'SS10'),
(4, 9000000.00, 2, 4, 'XM12'),
(5, 15000000.00, 1, 5, 'OP5');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ctquyen`
--

CREATE TABLE `ctquyen` (
  `IdQuyen` int(11) NOT NULL,
  `IdVaiTro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ctquyen`
--

INSERT INTO `ctquyen` (`IdQuyen`, `IdVaiTro`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 1),
(4, 1),
(4, 3),
(5, 1),
(5, 3),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(13, 2),
(14, 1),
(15, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dongsanpham`
--

CREATE TABLE `dongsanpham` (
  `IdDongSanPham` varchar(20) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `IdThuongHieu` int(11) DEFAULT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dongsanpham`
--

INSERT INTO `dongsanpham` (`IdDongSanPham`, `SoLuong`, `IdThuongHieu`, `TrangThai`) VALUES
('IP7', 5, 1, 1),
('IP8', 4, 1, 1),
('OP5', 1, 4, 0),
('SS10', 3, 2, 1),
('XM12', 2, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `IdHoaDon` int(11) NOT NULL,
  `IdTaiKhoan` int(11) DEFAULT NULL,
  `NgayTao` date NOT NULL,
  `ThanhTien` decimal(15,2) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL,
  `IdTinhTrang` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`IdHoaDon`, `IdTaiKhoan`, `NgayTao`, `ThanhTien`, `TrangThai`, `IdTinhTrang`) VALUES
(1, 3, '2025-03-01', 15000000.00, 1, 1),
(2, 3, '2025-03-02', 20000000.00, 1, 2),
(3, 4, '2025-03-05', 30000000.00, 1, 3),
(4, 3, '2025-03-10', 10000000.00, 0, 4),
(5, 4, '2025-03-15', 25000000.00, 1, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khuyenmai`
--

CREATE TABLE `khuyenmai` (
  `IdKhuyenMai` int(11) NOT NULL,
  `NgayBatDau` date NOT NULL,
  `NgayKetThuc` date NOT NULL,
  `PhanTramGiam` int(11) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khuyenmai`
--

INSERT INTO `khuyenmai` (`IdKhuyenMai`, `NgayBatDau`, `NgayKetThuc`, `PhanTramGiam`, `TrangThai`) VALUES
(1, '2025-03-01', '2025-03-10', 10, 1),
(2, '2025-03-05', '2025-03-15', 15, 1),
(3, '2025-03-10', '2025-03-20', 20, 1),
(4, '2025-03-15', '2025-03-25', 25, 1),
(5, '2025-03-20', '2025-03-30', 30, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `IdNguoiDung` int(11) NOT NULL,
  `HoVaTen` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`IdNguoiDung`, `HoVaTen`, `Email`, `DiaChi`, `SoDienThoai`, `TrangThai`) VALUES
(1, 'Nguyễn Văn Quản', 'nvq@gmail.com', 'Hà Nội', '0912345678', 1),
(2, 'Trần Thị Kho', 'ttk@gmail.com', 'TP.HCM', '0987654321', 1),
(3, 'Lê Văn Dùng', 'lvd@gmail.com', 'Đà Nẵng', '0935123456', 1),
(4, 'Phạm Thị Dùng', 'ptd@gmail.com', 'Hải Phòng', '0909123456', 1),
(5, 'Hoàng Văn Kho', 'hvk@gmail.com', 'Cần Thơ', '0923456789', 0),
(6, 'Đinh Bá Phong', 'zxczxc@gmail.com', 'zxczxczxc', '0932788919', 1),
(7, 'phong đẹp', 'zxczxc@gmail.com', 'zxczxcc', '0932788999', 1),
(8, 'phong đepxxx', 'zxczxc@gmail.com', 'zxczxczxc', '0932788999', 1),
(9, 'Đinh Bá Phong', 'phongba@imail.edu.vn', 'zxczxcc', '0932788999', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhacungcap`
--

CREATE TABLE `nhacungcap` (
  `IdNCC` int(11) NOT NULL,
  `TenNCC` varchar(100) NOT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhacungcap`
--

INSERT INTO `nhacungcap` (`IdNCC`, `TenNCC`, `DiaChi`, `SoDienThoai`, `Email`, `TrangThai`) VALUES
(1, 'Công ty TNHH A', 'Hà Nội', '0911111111', 'ctya@gmail.com', 1),
(2, 'Công ty TNHH B', 'TP.HCM', '0922222222', 'ctyb@gmail.com', 1),
(3, 'Công ty TNHH C', 'Đà Nẵng', '0933333333', 'ctyc@gmail.com', 1),
(4, 'Công ty TNHH D', 'Hải Phòng', '0944444444', 'ctyd@gmail.com', 1),
(5, 'Công ty TNHH E', 'Cần Thơ', '0955555555', 'ctye@gmail.com', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieunhap`
--

CREATE TABLE `phieunhap` (
  `IdPhieuNhap` int(11) NOT NULL,
  `IdTaiKhoan` int(11) DEFAULT NULL,
  `NgayNhap` date NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL,
  `IdNCC` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phieunhap`
--

INSERT INTO `phieunhap` (`IdPhieuNhap`, `IdTaiKhoan`, `NgayNhap`, `TrangThai`, `IdNCC`) VALUES
(1, 2, '2025-03-01', 1, 1),
(2, 2, '2025-03-02', 1, 2),
(3, 5, '2025-03-03', 1, 3),
(4, 2, '2025-03-04', 1, 4),
(5, 5, '2025-03-05', 0, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quyen`
--

CREATE TABLE `quyen` (
  `IdQuyen` int(11) NOT NULL,
  `TenQuyen` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quyen`
--

INSERT INTO `quyen` (`IdQuyen`, `TenQuyen`) VALUES
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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

CREATE TABLE `sanpham` (
  `IdCHSP` int(11) NOT NULL,
  `IdDongSanPham` varchar(20) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`IdCHSP`, `IdDongSanPham`, `SoLuong`, `TrangThai`) VALUES
(1, 'IP7', 5, 1),
(2, 'IP8', 4, 1),
(3, 'SS10', 3, 1),
(4, 'XM12', 2, 1),
(5, 'IP7', 10, 0),
(5, 'OP5', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanphamchitiet`
--

CREATE TABLE `sanphamchitiet` (
  `Imei` varchar(50) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL,
  `IdCHSP` int(11) DEFAULT NULL,
  `IdDongSanPham` varchar(20) DEFAULT NULL,
  `IdBaoHanh` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sanphamchitiet`
--

INSERT INTO `sanphamchitiet` (`Imei`, `TrangThai`, `IdCHSP`, `IdDongSanPham`, `IdBaoHanh`) VALUES
('352094108765401', 1, 4, 'XM12', 4),
('352094108765402', 1, 4, 'XM12', 4),
('354128907563201', 1, 1, 'IP7', 1),
('354128907563202', 1, 1, 'IP7', 1),
('354128907563203', 1, 1, 'IP7', 1),
('354128907563204', 1, 1, 'IP7', 1),
('354128907563205', 1, 1, 'IP7', 1),
('490154203237501', 1, 3, 'SS10', 3),
('490154203237502', 1, 3, 'SS10', 3),
('490154203237503', 1, 3, 'SS10', 3),
('867493021584901', 1, 2, 'IP8', 2),
('867493021584902', 1, 2, 'IP8', 2),
('867493021584903', 1, 2, 'IP8', 2),
('867493021584904', 1, 2, 'IP8', 2),
('987654321098701', 0, 5, 'OP5', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `IdTaiKhoan` int(11) NOT NULL,
  `TaiKhoan` varchar(50) NOT NULL,
  `MatKhau` varchar(100) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL,
  `IdVaiTro` int(11) DEFAULT NULL,
  `IdNguoiDung` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`IdTaiKhoan`, `TaiKhoan`, `MatKhau`, `TrangThai`, `IdVaiTro`, `IdNguoiDung`) VALUES
(1, 'quanly1', 'quanly123', 1, 1, 1),
(2, 'nhapkho1', 'nhapkho123', 1, 2, NULL),
(3, 'nguoidung1', 'nguoidung123', 1, 3, NULL),
(4, 'nguoidung2', 'nguoidung456', 1, 3, NULL),
(5, 'nhapkho2', 'nhapkho456', 1, 2, NULL),
(6, 'quanly2', 'quanly456', 0, 1, NULL),
(7, 'phongba2004', '01092004', 1, 3, 6),
(8, 'phongdeptrai', '01092004', 1, 3, 7),
(9, 'baphong', '01092004', 1, 3, 8),
(10, 'phongba2005', '$2y$10$1/4b5LfsrGxMpfqKGIZKI.kHCt0S/TL0Wy7IK3SjYWBhphNCSqwwi', 1, 3, 9);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuonghieu`
--

CREATE TABLE `thuonghieu` (
  `IdThuongHieu` int(11) NOT NULL,
  `TenThuongHieu` varchar(50) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thuonghieu`
--

INSERT INTO `thuonghieu` (`IdThuongHieu`, `TenThuongHieu`, `TrangThai`) VALUES
(1, 'Apple', 1),
(2, 'Samsung', 1),
(3, 'Xiaomi', 1),
(4, 'Oppo', 1),
(5, 'Vivo', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinhtrangvanchuyen`
--

CREATE TABLE `tinhtrangvanchuyen` (
  `IdTinhTrang` int(11) NOT NULL,
  `TenTinhTrang` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tinhtrangvanchuyen`
--

INSERT INTO `tinhtrangvanchuyen` (`IdTinhTrang`, `TenTinhTrang`) VALUES
(1, 'Chờ xử lý'),
(2, 'Đang giao'),
(3, 'Đã giao'),
(4, 'Hủy'),
(5, 'Hoàn trả');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vaitro`
--

CREATE TABLE `vaitro` (
  `IdVaiTro` int(11) NOT NULL,
  `TenVaiTro` varchar(50) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vaitro`
--

INSERT INTO `vaitro` (`IdVaiTro`, `TenVaiTro`, `TrangThai`) VALUES
(1, 'Người quản lý', 1),
(2, 'Nhập kho', 1),
(3, 'Người dùng', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `anh`
--
ALTER TABLE `anh`
  ADD PRIMARY KEY (`IdAnh`),
  ADD KEY `IdCHSP` (`IdCHSP`),
  ADD KEY `IdDongSanPham` (`IdDongSanPham`);

--
-- Chỉ mục cho bảng `baohanh`
--
ALTER TABLE `baohanh`
  ADD PRIMARY KEY (`IdBaoHanh`);

--
-- Chỉ mục cho bảng `cauhinhsanpham`
--
ALTER TABLE `cauhinhsanpham`
  ADD PRIMARY KEY (`IdCHSP`);

--
-- Chỉ mục cho bảng `cthoadon`
--
ALTER TABLE `cthoadon`
  ADD PRIMARY KEY (`IdHoaDon`,`Imei`),
  ADD KEY `Imei` (`Imei`);

--
-- Chỉ mục cho bảng `ctkhuyenmai`
--
ALTER TABLE `ctkhuyenmai`
  ADD PRIMARY KEY (`IdKhuyenMai`,`IdCHSP`,`IdDongSanPham`),
  ADD KEY `IdCHSP` (`IdCHSP`),
  ADD KEY `IdDongSanPham` (`IdDongSanPham`);

--
-- Chỉ mục cho bảng `ctphieunhap`
--
ALTER TABLE `ctphieunhap`
  ADD PRIMARY KEY (`IdPhieuNhap`,`IdCHSP`,`IdDongSanPham`),
  ADD KEY `IdCHSP` (`IdCHSP`),
  ADD KEY `IdDongSanPham` (`IdDongSanPham`);

--
-- Chỉ mục cho bảng `ctquyen`
--
ALTER TABLE `ctquyen`
  ADD PRIMARY KEY (`IdQuyen`,`IdVaiTro`),
  ADD KEY `IdVaiTro` (`IdVaiTro`);

--
-- Chỉ mục cho bảng `dongsanpham`
--
ALTER TABLE `dongsanpham`
  ADD PRIMARY KEY (`IdDongSanPham`),
  ADD KEY `IdThuongHieu` (`IdThuongHieu`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`IdHoaDon`),
  ADD KEY `IdTaiKhoan` (`IdTaiKhoan`),
  ADD KEY `IdTinhTrang` (`IdTinhTrang`);

--
-- Chỉ mục cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  ADD PRIMARY KEY (`IdKhuyenMai`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`IdNguoiDung`);

--
-- Chỉ mục cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD PRIMARY KEY (`IdNCC`);

--
-- Chỉ mục cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD PRIMARY KEY (`IdPhieuNhap`),
  ADD KEY `IdTaiKhoan` (`IdTaiKhoan`),
  ADD KEY `IdNCC` (`IdNCC`);

--
-- Chỉ mục cho bảng `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`IdQuyen`);

--
-- Chỉ mục cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`IdCHSP`,`IdDongSanPham`),
  ADD KEY `IdDongSanPham` (`IdDongSanPham`);

--
-- Chỉ mục cho bảng `sanphamchitiet`
--
ALTER TABLE `sanphamchitiet`
  ADD PRIMARY KEY (`Imei`),
  ADD KEY `IdCHSP` (`IdCHSP`),
  ADD KEY `IdDongSanPham` (`IdDongSanPham`),
  ADD KEY `IdBaoHanh` (`IdBaoHanh`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`IdTaiKhoan`),
  ADD KEY `IdVaiTro` (`IdVaiTro`),
  ADD KEY `IdNguoiDung` (`IdNguoiDung`);

--
-- Chỉ mục cho bảng `thuonghieu`
--
ALTER TABLE `thuonghieu`
  ADD PRIMARY KEY (`IdThuongHieu`);

--
-- Chỉ mục cho bảng `tinhtrangvanchuyen`
--
ALTER TABLE `tinhtrangvanchuyen`
  ADD PRIMARY KEY (`IdTinhTrang`);

--
-- Chỉ mục cho bảng `vaitro`
--
ALTER TABLE `vaitro`
  ADD PRIMARY KEY (`IdVaiTro`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `anh`
--
ALTER TABLE `anh`
  MODIFY `IdAnh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `baohanh`
--
ALTER TABLE `baohanh`
  MODIFY `IdBaoHanh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `cauhinhsanpham`
--
ALTER TABLE `cauhinhsanpham`
  MODIFY `IdCHSP` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `cthoadon`
--
ALTER TABLE `cthoadon`
  MODIFY `IdHoaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `ctkhuyenmai`
--
ALTER TABLE `ctkhuyenmai`
  MODIFY `IdKhuyenMai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  MODIFY `IdHoaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  MODIFY `IdKhuyenMai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `IdNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  MODIFY `IdNCC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  MODIFY `IdPhieuNhap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `quyen`
--
ALTER TABLE `quyen`
  MODIFY `IdQuyen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `IdCHSP` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `IdTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `thuonghieu`
--
ALTER TABLE `thuonghieu`
  MODIFY `IdThuongHieu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `anh`
--
ALTER TABLE `anh`
  ADD CONSTRAINT `anh_ibfk_1` FOREIGN KEY (`IdCHSP`) REFERENCES `sanpham` (`IdCHSP`),
  ADD CONSTRAINT `anh_ibfk_2` FOREIGN KEY (`IdDongSanPham`) REFERENCES `sanpham` (`IdDongSanPham`);

--
-- Các ràng buộc cho bảng `cthoadon`
--
ALTER TABLE `cthoadon`
  ADD CONSTRAINT `cthoadon_ibfk_1` FOREIGN KEY (`IdHoaDon`) REFERENCES `hoadon` (`IdHoaDon`),
  ADD CONSTRAINT `cthoadon_ibfk_2` FOREIGN KEY (`Imei`) REFERENCES `sanphamchitiet` (`Imei`);

--
-- Các ràng buộc cho bảng `ctkhuyenmai`
--
ALTER TABLE `ctkhuyenmai`
  ADD CONSTRAINT `ctkhuyenmai_ibfk_1` FOREIGN KEY (`IdKhuyenMai`) REFERENCES `khuyenmai` (`IdKhuyenMai`),
  ADD CONSTRAINT `ctkhuyenmai_ibfk_2` FOREIGN KEY (`IdCHSP`) REFERENCES `sanpham` (`IdCHSP`),
  ADD CONSTRAINT `ctkhuyenmai_ibfk_3` FOREIGN KEY (`IdDongSanPham`) REFERENCES `sanpham` (`IdDongSanPham`);

--
-- Các ràng buộc cho bảng `ctphieunhap`
--
ALTER TABLE `ctphieunhap`
  ADD CONSTRAINT `ctphieunhap_ibfk_1` FOREIGN KEY (`IdPhieuNhap`) REFERENCES `phieunhap` (`IdPhieuNhap`),
  ADD CONSTRAINT `ctphieunhap_ibfk_2` FOREIGN KEY (`IdCHSP`) REFERENCES `sanpham` (`IdCHSP`),
  ADD CONSTRAINT `ctphieunhap_ibfk_3` FOREIGN KEY (`IdDongSanPham`) REFERENCES `sanpham` (`IdDongSanPham`);

--
-- Các ràng buộc cho bảng `ctquyen`
--
ALTER TABLE `ctquyen`
  ADD CONSTRAINT `ctquyen_ibfk_1` FOREIGN KEY (`IdQuyen`) REFERENCES `quyen` (`IdQuyen`),
  ADD CONSTRAINT `ctquyen_ibfk_2` FOREIGN KEY (`IdVaiTro`) REFERENCES `vaitro` (`IdVaiTro`);

--
-- Các ràng buộc cho bảng `dongsanpham`
--
ALTER TABLE `dongsanpham`
  ADD CONSTRAINT `dongsanpham_ibfk_1` FOREIGN KEY (`IdThuongHieu`) REFERENCES `thuonghieu` (`IdThuongHieu`);

--
-- Các ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `hoadon_ibfk_1` FOREIGN KEY (`IdTaiKhoan`) REFERENCES `taikhoan` (`IdTaiKhoan`),
  ADD CONSTRAINT `hoadon_ibfk_2` FOREIGN KEY (`IdTinhTrang`) REFERENCES `tinhtrangvanchuyen` (`IdTinhTrang`);

--
-- Các ràng buộc cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD CONSTRAINT `phieunhap_ibfk_1` FOREIGN KEY (`IdTaiKhoan`) REFERENCES `taikhoan` (`IdTaiKhoan`),
  ADD CONSTRAINT `phieunhap_ibfk_2` FOREIGN KEY (`IdNCC`) REFERENCES `nhacungcap` (`IdNCC`);

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`IdCHSP`) REFERENCES `cauhinhsanpham` (`IdCHSP`),
  ADD CONSTRAINT `sanpham_ibfk_2` FOREIGN KEY (`IdDongSanPham`) REFERENCES `dongsanpham` (`IdDongSanPham`);

--
-- Các ràng buộc cho bảng `sanphamchitiet`
--
ALTER TABLE `sanphamchitiet`
  ADD CONSTRAINT `sanphamchitiet_ibfk_1` FOREIGN KEY (`IdCHSP`) REFERENCES `sanpham` (`IdCHSP`),
  ADD CONSTRAINT `sanphamchitiet_ibfk_2` FOREIGN KEY (`IdDongSanPham`) REFERENCES `sanpham` (`IdDongSanPham`),
  ADD CONSTRAINT `sanphamchitiet_ibfk_3` FOREIGN KEY (`IdBaoHanh`) REFERENCES `baohanh` (`IdBaoHanh`);

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`IdVaiTro`) REFERENCES `vaitro` (`IdVaiTro`),
  ADD CONSTRAINT `taikhoan_ibfk_2` FOREIGN KEY (`IdNguoiDung`) REFERENCES `nguoidung` (`IdNguoiDung`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
