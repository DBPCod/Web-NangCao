<?php 
include_once '../core/DB.php';

class BaohanhModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllWarranties() {
        $result = $this->db->query("SELECT * FROM baohanh where trangthai != 0");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getWarrantyById($idBaoHanh) {
        $stmt = $this->db->prepare("SELECT * FROM baohanh WHERE IdBaoHanh = ?");
        $stmt->bind_param("i", $idBaoHanh);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addWarranty($data) {
        $stmt = $this->db->prepare("INSERT INTO baohanh (IdBaoHanh, ThoiGianBaoHanh, TrangThai) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $data['IdBaoHanh'], $data['ThoiGianBaoHanh'], $data['TrangThai']);
        $stmt->execute();
        return $this->getWarrantyById($data['IdBaoHanh']);
    }

    public function updateWarranty($idBaoHanh, $thoiGianBaoHanh, $trangThai) {
        $stmt = $this->db->prepare("UPDATE baohanh SET ThoiGianBaoHanh = ?, TrangThai = ? WHERE IdBaoHanh = ?");
        $stmt->bind_param("iii", $thoiGianBaoHanh, $trangThai, $idBaoHanh);
        return $stmt->execute();
    }

    public function deleteWarranty($idBaoHanh) {
        $stmt = $this->db->prepare("UPDATE baohanh SET TrangThai = 0 WHERE IdBaoHanh = ?");
        $stmt->bind_param("i", $idBaoHanh);
        return $stmt->execute();
    }
}
?>
