<?php
include_once __DIR__ . '../../core/DB.php';

class SanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllProducts() {
        $result = $this->db->query("SELECT * FROM sanpham WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getProductById($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("SELECT * FROM sanpham WHERE IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("ii", $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addProduct($data) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO sanpham (IdCHSP, IdDongSanPham, SoLuong, Gia, TrangThai) VALUES (?, ?, ?, ?, ?)");
            $gia = $data['Gia'] ?? 0;
            $stmt->bind_param("iiidi", $data['IdCHSP'], $data['IdDongSanPham'], $data['SoLuong'], $gia, $data['TrangThai']);
            $stmt->execute();
            $this->db->commit();
            return $this->getProductById($data['IdCHSP'], $data['IdDongSanPham']);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm sản phẩm: " . $e->getMessage());
        }
    }

    public function updateProduct($idCHSP, $idDSP, $soLuong, $gia, $trangThai) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("UPDATE sanpham SET SoLuong = ?, Gia = ?, TrangThai = ? WHERE IdCHSP = ? AND IdDongSanPham = ?");
            $stmt->bind_param("idiii", $soLuong, $gia, $trangThai, $idCHSP, $idDSP);
            $stmt->execute();
            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi cập nhật sản phẩm: " . $e->getMessage());
        }
    }

    public function deleteProduct($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("UPDATE sanpham SET TrangThai = 0 WHERE IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("ii", $idCHSP, $idDSP);
        return $stmt->execute();
    }
}
?>