<?php
include_once '../core/DB.php';

class SanPhamChiTietModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllSanPhamChiTiet() {
        $result = $this->db->query("SELECT * FROM sanphamchitiet WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getSanPhamChiTietByImei($imei) {
        $stmt = $this->db->prepare("SELECT * FROM sanphamchitiet WHERE Imei = ?");
        $stmt->bind_param("s", $imei);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addSanPhamChiTiet($data) {
        $this->db->begin_transaction();
        try {
            $existing = $this->getSanPhamChiTietByImei($data['Imei']);
            if ($existing) {
                throw new Exception("IMEI đã tồn tại");
            }
            if (!isset($data['IdPhieuNhap'])) {
                throw new Exception("Thiếu IdPhieuNhap");
            }
            $stmt = $this->db->prepare("INSERT INTO sanphamchitiet (Imei, TrangThai, IdCHSP, IdDongSanPham, IdBaoHanh, IdPhieuNhap) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("siiiii", $data['Imei'], $data['TrangThai'], $data['IdCHSP'], $data['IdDongSanPham'], $data['IdBaoHanh'], $data['IdPhieuNhap']);
            $stmt->execute();
            $this->db->commit();
            return $this->getSanPhamChiTietByImei($data['Imei']);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm sản phẩm chi tiết: " . $e->getMessage());
        }
    }

    public function updateSanPhamChiTiet($imei, $trangThai, $idCHSP, $idDongSanPham, $idBaoHanh, $idPhieuNhap = null) {
        $this->db->begin_transaction();
        try {
            if ($idPhieuNhap !== null) {
                $stmt = $this->db->prepare("UPDATE sanphamchitiet SET TrangThai = ?, IdCHSP = ?, IdDongSanPham = ?, IdBaoHanh = ?, IdPhieuNhap = ? WHERE Imei = ?");
                $stmt->bind_param("iiiiis", $trangThai, $idCHSP, $idDongSanPham, $idBaoHanh, $idPhieuNhap, $imei);
            } else {
                $stmt = $this->db->prepare("UPDATE sanphamchitiet SET TrangThai = ?, IdCHSP = ?, IdDongSanPham = ?, IdBaoHanh = ? WHERE Imei = ?");
                $stmt->bind_param("iiiis", $trangThai, $idCHSP, $idDongSanPham, $idBaoHanh, $imei);
            }
            $stmt->execute();
            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi cập nhật sản phẩm chi tiết: " . $e->getMessage());
        }
    }

    public function deleteSanPhamChiTiet($idPhieuNhap) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("UPDATE sanphamchitiet SET TrangThai = 0 WHERE IdPhieuNhap = ?");
            $stmt->bind_param("i", $idPhieuNhap);
            $stmt->execute();
            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi xóa sản phẩm chi tiết: " . $e->getMessage());
        }
    }

    public function getAndLockSanPhamChiTietByCHSPandDSP($idCHSP, $idDongSanPham) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("
                SELECT * 
                FROM sanphamchitiet 
                WHERE IdCHSP = ? AND IdDongSanPham = ? AND TrangThai = 1 
                LIMIT 1
            ");
            $stmt->bind_param("ii", $idCHSP, $idDongSanPham);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            if (!$result) {
                throw new Exception("Không tìm thấy sản phẩm chi tiết phù hợp");
            }

            $stmt = $this->db->prepare("
                UPDATE sanphamchitiet 
                SET TrangThai = 0 
                WHERE Imei = ?
            ");
            $stmt->bind_param("s", $result['Imei']);
            $stmt->execute();

            $this->db->commit();
            return $result;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi khi lấy và khóa sản phẩm chi tiết: " . $e->getMessage());
        }
    }

    public function getAndLockMultipleSanPhamChiTiet($idCHSP, $idDongSanPham, $quantity) {
        $this->db->begin_transaction();
        try {
            // Lấy số lượng bản ghi yêu cầu
            $stmt = $this->db->prepare("
                SELECT * 
                FROM sanphamchitiet 
                WHERE IdCHSP = ? AND IdDongSanPham = ? AND TrangThai = 1 
                LIMIT ?
            ");
            $stmt->bind_param("iii", $idCHSP, $idDongSanPham, $quantity);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

            if (count($result) < $quantity) {
                throw new Exception("Chỉ còn " . count($result) . " sản phẩm trong kho, không đủ " . $quantity . " sản phẩm yêu cầu");
            }

            // Khóa tất cả bản ghi bằng cách cập nhật TrangThai = 0
            foreach ($result as $item) {
                $stmt = $this->db->prepare("
                    UPDATE sanphamchitiet 
                    SET TrangThai = 0 
                    WHERE Imei = ?
                ");
                $stmt->bind_param("s", $item['Imei']);
                $stmt->execute();
            }

            $this->db->commit();
            return $result;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi khi lấy và khóa nhiều sản phẩm chi tiết: " . $e->getMessage());
        }
    }
}
?>