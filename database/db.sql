-- Tạo bảng Quyen (Quyền)
CREATE TABLE Quyen (
    IdQuyen INT PRIMARY KEY,
    TenQuyen VARCHAR(50) NOT NULL
);

-- Tạo bảng VaiTro (Vai trò)
CREATE TABLE VaiTro (
    IdVaiTro INT PRIMARY KEY,
    TenVaiTro VARCHAR(50) NOT NULL,
    TrangThai BOOLEAN -- Thêm trường TrangThai theo sơ đồ
);

-- Tạo bảng CTQuyen (Chi tiết quyền - bảng trung gian giữa Quyen và VaiTro)
CREATE TABLE CTQuyen (
    IdQuyen INT,
    IdVaiTro INT,
    PRIMARY KEY (IdQuyen, IdVaiTro),
    FOREIGN KEY (IdQuyen) REFERENCES Quyen(IdQuyen),
    FOREIGN KEY (IdVaiTro) REFERENCES VaiTro(IdVaiTro)
);

-- Tạo bảng TaiKhoan (Tài khoản)
CREATE TABLE TaiKhoan (
    IdTaiKhoan INT PRIMARY KEY,
    TaiKhoan VARCHAR(50) NOT NULL,
    MatKhau VARCHAR(100) NOT NULL,
    TrangThai BOOLEAN, -- Thêm trường TrangThai theo sơ đồ
    IdVaiTro INT,
    FOREIGN KEY (IdVaiTro) REFERENCES VaiTro(IdVaiTro)
);

-- Tạo bảng NguoiDung (Người dùng)
CREATE TABLE NguoiDung (
    IdNguoiDung INT PRIMARY KEY,
    HoVaTen VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255),
    SoDienThoai VARCHAR(15),
    TrangThai BOOLEAN -- Thêm trường TrangThai theo sơ đồ
);

-- Tạo bảng TinhTrangVanChuyen (Tình trạng vận chuyển)
CREATE TABLE TinhTrangVanChuyen (
    IdTinhTrang INT PRIMARY KEY,
    TenTinhTrang VARCHAR(50) NOT NULL
);

-- Tạo bảng HoaDon (Hóa đơn)
CREATE TABLE HoaDon (
    IdHoaDon INT PRIMARY KEY,
    IdTaiKhoan INT,
    NgayTao DATE NOT NULL,
    ThanhTien DECIMAL(15,2) NOT NULL,
    TrangThai BOOLEAN, -- Thêm trường TrangThai theo sơ đồ
    IdTinhTrang INT,
    FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(IdTaiKhoan),
    FOREIGN KEY (IdTinhTrang) REFERENCES TinhTrangVanChuyen(IdTinhTrang)
);

-- Tạo bảng ThuongHieu (Thương hiệu)
CREATE TABLE ThuongHieu (
    IdThuongHieu INT PRIMARY KEY,
    TenThuongHieu VARCHAR(50) NOT NULL,
    TrangThai BOOLEAN -- Thêm trường TrangThai theo sơ đồ
);

-- Tạo bảng NhaCungCap (Nhà cung cấp)
CREATE TABLE NhaCungCap (
    IdNCC INT PRIMARY KEY,
    TenNCC VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255),
    SoDienThoai VARCHAR(15),
    Email VARCHAR(100),
    TrangThai BOOLEAN -- Thêm trường TrangThai theo sơ đồ
);

-- Tạo bảng CauHinhSanPham (Cấu hình sản phẩm)
CREATE TABLE CauHinhSanPham (
    IdCHSP INT PRIMARY KEY,
    Ram VARCHAR(20),
    Rom VARCHAR(20),
    ManHinh VARCHAR(50),
    Pin VARCHAR(20),
    MauSac VARCHAR(50), -- Thêm trường MauSac theo sơ đồ
    Camera VARCHAR(50),
    TrangThai BOOLEAN, -- Thêm trường TrangThai theo sơ đồ
    IdNCC INT,
    FOREIGN KEY (IdNCC) REFERENCES NhaCungCap(IdNCC)
);

-- Tạo bảng DongSanPham (Dòng sản phẩm)
CREATE TABLE DongSanPham (
    IdDongSanPham VARCHAR(20) PRIMARY KEY,
    SoLuong INT NOT NULL,
    IdThuongHieu INT,
    TrangThai BOOLEAN, -- Thêm trường TrangThai theo sơ đồ
    FOREIGN KEY (IdThuongHieu) REFERENCES ThuongHieu(IdThuongHieu)
);

-- Tạo bảng SanPham (Sản phẩm)
CREATE TABLE SanPham (
    IdCHSP INT PRIMARY KEY,
    IdDongSanPham VARCHAR(20),
    SoLuong INT NOT NULL,
    FOREIGN KEY (IdCHSP) REFERENCES CauHinhSanPham(IdCHSP),
    FOREIGN KEY (IdDongSanPham) REFERENCES DongSanPham(IdDongSanPham)
);

-- Tạo bảng Anh (Ảnh)
CREATE TABLE Anh (
    IdAnh INT PRIMARY KEY,
    Anh VARCHAR(255), -- Lưu đường dẫn hoặc tên file ảnh
    IdCHSP INT,
    IdDongSanPham VARCHAR(20),
    FOREIGN KEY (IdCHSP) REFERENCES SanPham(IdCHSP),
    FOREIGN KEY (IdDongSanPham) REFERENCES SanPham(IdDongSanPham)
);

CREATE TABLE BaoHanh (
    IdBaoHanh INT PRIMARY KEY,
    ThoiGianBaoHanh INT NOT NULL, -- Thời gian bảo hành (tháng hoặc năm)
    TrangThai BOOLEAN -- Thêm trường TrangThai theo sơ đồ
    
);

-- Tạo bảng SanPhamChiTiet (Sản phẩm chi tiết)
CREATE TABLE SanPhamChiTiet (
    Imei VARCHAR(50) PRIMARY KEY,
    TrangThai BOOLEAN, -- Thêm trường TrangThai theo sơ đồ
    IdCHSP INT,
    IdDongSanPham VARCHAR(20),
    IdBaoHanh INT,
    FOREIGN KEY (IdCHSP) REFERENCES SanPham(IdCHSP),
    FOREIGN KEY (IdDongSanPham) REFERENCES SanPham(IdDongSanPham),
    FOREIGN KEY (IdBaoHanh) REFERENCES BaoHanh(IdBaoHanh)
);


-- Tạo bảng BaoHanh (Bảo hành)


-- Tạo bảng KhuyenMai (Khuyến mãi)
CREATE TABLE KhuyenMai (
    IdKhuyenMai INT PRIMARY KEY,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    PhanTramGiam INT NOT NULL,
    TrangThai BOOLEAN -- Thêm trường TrangThai theo sơ đồ
);

-- Tạo bảng CTKhuyenMai (Chi tiết khuyến mãi - bảng trung gian)
CREATE TABLE CTKhuyenMai (
    IdKhuyenMai INT,
    IdSanPham INT,
    PRIMARY KEY (IdKhuyenMai, IdSanPham),
    FOREIGN KEY (IdKhuyenMai) REFERENCES KhuyenMai(IdKhuyenMai),
    FOREIGN KEY (IdSanPham) REFERENCES SanPham(IdCHSP)
);

-- Tạo bảng GioHang (Giỏ hàng)
CREATE TABLE GioHang (
    IdTaiKhoan INT,
    IdSanPham INT,
    SoLuong INT NOT NULL,
    PRIMARY KEY (IdTaiKhoan, IdSanPham),
    FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(IdTaiKhoan),
    FOREIGN KEY (IdSanPham) REFERENCES SanPham(IdCHSP)
);

-- Tạo bảng PhieuNhap (Phiếu nhập)
CREATE TABLE PhieuNhap (
    IdPhieuNhap INT PRIMARY KEY,
    IdTaiKhoan INT,
    NgayNhap DATE NOT NULL,
    TrangThai BOOLEAN, -- Thêm trường TrangThai theo sơ đồ
    IdNCC INT,
    FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(IdTaiKhoan),
    FOREIGN KEY (IdNCC) REFERENCES NhaCungCap(IdNCC)
);

-- Tạo bảng CTPhieuNhap (Chi tiết phiếu nhập)
CREATE TABLE CTPhieuNhap (
    IdPhieuNhap INT,
    GiaNhap DECIMAL(15,2) NOT NULL,
    SoLuong INT NOT NULL,
    IdCHSP INT,
    IdDongSanPham VARCHAR(20),
    PRIMARY KEY (IdPhieuNhap, IdCHSP, IdDongSanPham),
    FOREIGN KEY (IdPhieuNhap) REFERENCES PhieuNhap(IdPhieuNhap),
    FOREIGN KEY (IdCHSP) REFERENCES CauHinhSanPham(IdCHSP),
    FOREIGN KEY (IdDongSanPham) REFERENCES DongSanPham(IdDongSanPham)
);

-- Tạo bảng CTHoaDon (Chi tiết hóa đơn)
CREATE TABLE CTHoaDon (
    IdHoaDon INT,
    GiaTien DECIMAL(15,2) NOT NULL,
    SoLuong INT NOT NULL,
    Imei VARCHAR(50),
    PRIMARY KEY (IdHoaDon, Imei),
    FOREIGN KEY (IdHoaDon) REFERENCES HoaDon(IdHoaDon),
    FOREIGN KEY (Imei) REFERENCES SanPhamChiTiet(Imei)
);