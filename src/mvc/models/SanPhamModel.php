<?php
include_once __DIR__ . '../../core/DB.php';

class SanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllProducts() {
        $result = $this->db->query("SELECT * FROM sanpham where trangthai=1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getProductById($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("SELECT * FROM sanpham WHERE IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("is", $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addProduct($data) {
        $stmt = $this->db->prepare("INSERT INTO sanpham (IdCHSP, IdDongSanPham, SoLuong, Gia, TrangThai) VALUES (?, ?, ?, ?, ?)");
        $gia = $data['Gia'] ?? 0; // Mặc định Gia = 0 nếu không được cung cấp
        $stmt->bind_param("isidi", $data['IdCHSP'], $data['IdDongSanPham'], $data['SoLuong'], $gia, $data['TrangThai']);
        $stmt->execute();
        return $this->getProductById($data['IdCHSP'], $data['IdDongSanPham']);
    }

    public function updateProduct($idCHSP, $idDSP, $soLuong, $trangThai) {
        $stmt = $this->db->prepare("UPDATE sanpham SET SoLuong = ?, TrangThai = ? WHERE IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("iiis", $soLuong, $trangThai, $idCHSP, $idDSP);
        return $stmt->execute();
    }

    public function deleteProduct($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("UPDATE sanpham SET TrangThai = ? WHERE IdCHSP = ? AND IdDongSanPham = ?");
        $trangThai = 0;
        $stmt->bind_param("iis", $trangThai, $idCHSP, $idDSP);
        return $stmt->execute();
    }
}
?>