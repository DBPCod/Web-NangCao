<?php
include_once __DIR__ . '../../core/DB.php';
// include_once '../core/DB.php';
class DongSanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllDongSanPham() {
        $result = $this->db->query("SELECT * FROM dongsanpham");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getDongSanPhamById($idDongSanPham) {
        $stmt = $this->db->prepare("SELECT * FROM dongsanpham WHERE IdDongSanPham = ?");
        $stmt->bind_param("s", $idDongSanPham);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addDongSanPham($data) {
        $stmt = $this->db->prepare("INSERT INTO dongsanpham (IdDongSanPham, SoLuong, IdThuongHieu, TrangThai) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("siib", $data['IdDongSanPham'], $data['SoLuong'], $data['IdThuongHieu'], $data['TrangThai']);
        $stmt->execute();
        return $this->getDongSanPhamById($data['IdDongSanPham']);
    }

    public function updateDongSanPham($idDongSanPham, $soLuong, $idThuongHieu, $trangThai) {
        $stmt = $this->db->prepare("UPDATE dongsanpham SET SoLuong = ?, IdThuongHieu = ?, TrangThai = ? WHERE IdDongSanPham = ?");
        $stmt->bind_param("iibs", $soLuong, $idThuongHieu, $trangThai, $idDongSanPham);
        return $stmt->execute();
    }

    public function deleteDongSanPham($idDongSanPham) {
        $stmt = $this->db->prepare("UPDATE dongsanpham SET TrangThai = ? WHERE IdDongSanPham = ?");
        $TrangThai = 0;
        $stmt->bind_param("is", $TrangThai, $idDongSanPham); // sua tu bs thanh is 
        return $stmt->execute();
    }
}
?>