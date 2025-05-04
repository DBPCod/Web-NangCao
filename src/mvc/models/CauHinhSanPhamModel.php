<?php
include_once __DIR__ . '/../core/DB.php';

class CauHinhSanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả cấu hình sản phẩm  
    public function getAllCauHinh() {
        $result = $this->db->query("SELECT * FROM CauHinhSanPham where trangthai=1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy cấu hình sản phẩm theo IdCHSP
    public function getCauHinhById($idCHSP) {
        $stmt = $this->db->prepare("SELECT * FROM CauHinhSanPham WHERE IdCHSP = ?");
        $stmt->bind_param("i", $idCHSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm cấu hình sản phẩm mới
    public function addCauHinh($data) {
        $stmt = $this->db->prepare("INSERT INTO CauHinhSanPham (Ram, Rom, ManHinh, Pin, MauSac, Camera, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssi", $data['Ram'], $data['Rom'], $data['ManHinh'], $data['Pin'], $data['MauSac'], $data['Camera'], $data['TrangThai']);
        $stmt->execute();
        return $this->getCauHinhById($this->db->insert_id);
    }

    // Cập nhật cấu hình sản phẩm
    public function updateCauHinh($idCHSP, $data) {
        $stmt = $this->db->prepare("UPDATE CauHinhSanPham SET Ram = ?, Rom = ?, ManHinh = ?, Pin = ?, MauSac = ?, Camera = ?, TrangThai = ? WHERE IdCHSP = ?");
        $stmt->bind_param("ssssssii", $data['Ram'], $data['Rom'], $data['ManHinh'], $data['Pin'], $data['MauSac'], $data['Camera'], $data['TrangThai'], $idCHSP);
        return $stmt->execute();
    }

    // Xóa cấu hình sản phẩm (cập nhật trạng thái)
    public function deleteCauHinh($idCHSP) {
        $stmt = $this->db->prepare("UPDATE CauHinhSanPham SET TrangThai = 0 WHERE IdCHSP = ?");
        $stmt->bind_param("i", $idCHSP);
        return $stmt->execute();
    }
}
?>
