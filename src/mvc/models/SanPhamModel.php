<?php
include_once __DIR__ . '../../core/DB.php';

class SanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllProducts() {
        $result = $this->db->query("
            SELECT sp.*, chsp.Ram, chsp.Rom, chsp.ManHinh, chsp.Pin, chsp.MauSac, chsp.Camera, dsp.TenDong,
                   km.PhanTramGiam,
                   CASE 
                       WHEN km.PhanTramGiam IS NOT NULL 
                       THEN sp.Gia - (sp.Gia * km.PhanTramGiam / 100) 
                       ELSE NULL 
                   END AS GiaGiam
            FROM sanpham sp
            JOIN CauHinhSanPham chsp ON sp.IdCHSP = chsp.IdCHSP
            JOIN dongsanpham dsp ON sp.IdDongSanPham = dsp.IdDongSanPham
            LEFT JOIN ctkhuyenmai ctkm ON dsp.IdDongSanPham = ctkm.IdDongSanPham
            LEFT JOIN khuyenmai km ON ctkm.IdKhuyenMai = km.IdKhuyenMai 
                AND km.NgayBatDau <= CURDATE() 
                AND km.NgayKetThuc >= CURDATE() 
                AND km.TrangThai != 0
            WHERE sp.TrangThai = 1 AND chsp.TrangThai = 1 AND dsp.TrangThai = 1
        ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAllProductsSortedByNgayNhap() {
        $result = $this->db->query("
            SELECT sp.*, chsp.Ram, chsp.Rom, chsp.ManHinh, chsp.Pin, chsp.MauSac, chsp.Camera, dsp.TenDong,
                   km.PhanTramGiam,
                   CASE 
                       WHEN km.PhanTramGiam IS NOT NULL 
                       THEN sp.Gia - (sp.Gia * km.PhanTramGiam / 100) 
                       ELSE NULL 
                   END AS GiaGiam
            FROM sanpham sp
            JOIN CauHinhSanPham chsp ON sp.IdCHSP = chsp.IdCHSP
            JOIN dongsanpham dsp ON sp.IdDongSanPham = dsp.IdDongSanPham
            LEFT JOIN ctkhuyenmai ctkm ON dsp.IdDongSanPham = ctkm.IdDongSanPham
            LEFT JOIN khuyenmai km ON ctkm.IdKhuyenMai = km.IdKhuyenMai 
                AND km.NgayBatDau <= CURDATE() 
                AND km.NgayKetThuc >= CURDATE() 
                AND km.TrangThai != 0
            WHERE sp.TrangThai = 1 AND chsp.TrangThai = 1 AND dsp.TrangThai = 1
            ORDER BY sp.NgayNhap DESC, dsp.TenDong ASC
        ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getProductsByDongSanPham($idDSP) {
        $stmt = $this->db->prepare("
            SELECT sp.IdCHSP, sp.IdDongSanPham, sp.Gia, sp.SoLuong, sp.TrangThai, 
                   chsp.Ram, chsp.Rom, chsp.ManHinh, chsp.Pin, chsp.MauSac, chsp.Camera,
                   dsp.TenDong, dsp.IdThuongHieu,
                   km.PhanTramGiam,
                   CASE 
                       WHEN km.PhanTramGiam IS NOT NULL 
                       THEN sp.Gia - (sp.Gia * km.PhanTramGiam / 100) 
                       ELSE NULL 
                   END AS GiaGiam
            FROM SanPham sp
            JOIN CauHinhSanPham chsp ON sp.IdCHSP = chsp.IdCHSP
            JOIN dongsanpham dsp ON sp.IdDongSanPham = dsp.IdDongSanPham
            LEFT JOIN ctkhuyenmai ctkm ON dsp.IdDongSanPham = ctkm.IdDongSanPham
            LEFT JOIN khuyenmai km ON ctkm.IdKhuyenMai = km.IdKhuyenMai 
                AND km.NgayBatDau <= CURDATE() 
                AND km.NgayKetThuc >= CURDATE() 
                AND km.TrangThai != 0
            WHERE sp.IdDongSanPham = ? AND sp.TrangThai = 1 AND chsp.TrangThai = 1 AND dsp.TrangThai = 1
        ");
        $stmt->bind_param("i", $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getProductById($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("
            SELECT sp.*, chsp.Ram, chsp.Rom, chsp.ManHinh, chsp.Pin, chsp.MauSac, chsp.Camera,
                   dsp.TenDong,
                   km.PhanTramGiam,
                   CASE 
                       WHEN km.PhanTramGiam IS NOT NULL 
                       THEN sp.Gia - (sp.Gia * km.PhanTramGiam / 100) 
                       ELSE NULL 
                   END AS GiaGiam
            FROM sanpham sp
            JOIN CauHinhSanPham chsp ON sp.IdCHSP = chsp.IdCHSP
            JOIN dongsanpham dsp ON sp.IdDongSanPham = dsp.IdDongSanPham
            LEFT JOIN ctkhuyenmai ctkm ON dsp.IdDongSanPham = ctkm.IdDongSanPham
            LEFT JOIN khuyenmai km ON ctkm.IdKhuyenMai = km.IdKhuyenMai 
                AND km.NgayBatDau <= CURDATE() 
                AND km.NgayKetThuc >= CURDATE() 
                AND km.TrangThai != 0
            WHERE sp.IdCHSP = ? AND sp.IdDongSanPham = ? AND sp.TrangThai = 1 AND chsp.TrangThai = 1 AND dsp.TrangThai = 1
        ");
        $stmt->bind_param("ii", $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    private function updateDongSanPhamQuantity($idDongSanPham) {
        $stmt = $this->db->prepare("
            SELECT SUM(SoLuong) as total 
            FROM sanpham 
            WHERE IdDongSanPham = ? AND TrangThai = 1
        ");
        $stmt->bind_param("i", $idDongSanPham);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $totalQuantity = $result['total'] ?? 0;

        $stmt = $this->db->prepare("
            UPDATE dongsanpham 
            SET SoLuong = ? 
            WHERE IdDongSanPham = ?
        ");
        $stmt->bind_param("ii", $totalQuantity, $idDongSanPham);
        $stmt->execute();
    }

    public function addProduct($data) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM sanpham 
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("ii", $data['IdCHSP'], $data['IdDongSanPham']);
            $stmt->execute();
            $existingProduct = $stmt->get_result()->fetch_assoc();

            if ($existingProduct) {
                if ($existingProduct['TrangThai'] == 1) {
                    throw new Exception("Sản phẩm đã tồn tại và đang hoạt động.");
                } else {
                    $stmt = $this->db->prepare("
                        UPDATE sanpham 
                        SET TrangThai = 1,
                            SoLuong = 0,
                            Gia = ?,
                            NgayNhap = NOW()
                        WHERE IdCHSP = ? AND IdDongSanPham = ?
                    ");
                    $gia = $data['Gia'] ?? $existingProduct['Gia'];
                    $stmt->bind_param("dii", $gia, $data['IdCHSP'], $data['IdDongSanPham']);
                    $stmt->execute();
                }
            } else {
                $stmt = $this->db->prepare("
                    INSERT INTO sanpham (IdCHSP, IdDongSanPham, SoLuong, Gia, NgayNhap, TrangThai) 
                    VALUES (?, ?, ?, ?, NOW(), ?)
                ");
                $gia = $data['Gia'] ?? 0;
                $trangThai = $data['TrangThai'] ?? 1;
                $soLuong = $data['SoLuong'] ?? 0;
                $stmt->bind_param("iidi", $data['IdCHSP'], $data['IdDongSanPham'], $soLuong, $gia, $trangThai);
                $stmt->execute();
            }

            $this->updateDongSanPhamQuantity($data['IdDongSanPham']);

            $this->db->commit();
            return $this->getProductById($data['IdCHSP'], $data['IdDongSanPham']);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception($e->getMessage());
        }
    }

    public function updateProduct($idCHSP, $idDSP, $soLuong, $gia, $trangThai, $NgayNhap) {
        $this->db->begin_transaction();
        try {   
            $stmt = $this->db->prepare("
                UPDATE sanpham 
                SET SoLuong = ?, Gia = ?, TrangThai = ?, NgayNhap = ?
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("idisii", $soLuong, $gia, $trangThai, $NgayNhap, $idCHSP, $idDSP);
            $stmt->execute();

            $this->updateDongSanPhamQuantity($idDSP);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi cập nhật sản phẩm: " . $e->getMessage());
        }
    }

    public function deleteProduct($idCHSP, $idDSP) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("
                UPDATE sanpham 
                SET TrangThai = 0 
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("ii", $idCHSP, $idDSP);
            $stmt->execute();

            $this->updateDongSanPhamQuantity($idDSP);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi xóa sản phẩm: " . $e->getMessage());
        }
    }
}
?>