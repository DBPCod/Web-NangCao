<?php
include_once '../core/DB.php';

class VaiTroModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả vai trò
    public function getAllVaiTro() {
        $result = $this->db->query("SELECT * FROM vaitro");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy vai trò theo IdVaiTro
    public function getVaiTroById($idVaiTro) {
        $stmt = $this->db->prepare("SELECT * FROM vaitro WHERE IdVaiTro = ?");
        $stmt->bind_param("i", $idVaiTro);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm vai trò mới
    public function addVaiTro($data) {
        $stmt = $this->db->prepare("INSERT INTO vaitro (IdVaiTro, TenVaiTro, TrangThai) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $data['IdVaiTro'], $data['TenVaiTro'], $data['TrangThai']);
        $stmt->execute();
        return $this->getVaiTroById($data['IdVaiTro']);
    }

    // Cập nhật vai trò
    public function updateVaiTro($idVaiTro, $tenVaiTro, $trangThai) {
        $stmt = $this->db->prepare("UPDATE vaitro SET TenVaiTro = ?, TrangThai = ? WHERE IdVaiTro = ?");
        $stmt->bind_param("sii", $tenVaiTro, $trangThai, $idVaiTro);
        return $stmt->execute();
    }

    // Xóa vai trò (Chuyển trạng thái)
    public function deleteVaiTro($idVaiTro) {
        $stmt = $this->db->prepare("UPDATE vaitro SET TrangThai = 0 WHERE IdVaiTro = ?");
        $stmt->bind_param("i", $idVaiTro);
        return $stmt->execute();
    }
}
?>
