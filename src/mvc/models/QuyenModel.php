<?php
include_once '../core/DB.php';

class QuyenModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả quyền
    public function getAllQuyen() {
        $result = $this->db->query("SELECT * FROM quyen");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy quyền theo ID
    public function getQuyenById($idQuyen) {
        $stmt = $this->db->prepare("SELECT * FROM quyen WHERE IdQuyen = ?");
        $stmt->bind_param("i", $idQuyen);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm quyền mới
    public function addQuyen($data) {
        $stmt = $this->db->prepare("INSERT INTO quyen (IdQuyen, TenQuyen) VALUES (?, ?)");
        $stmt->bind_param("is", $data['IdQuyen'], $data['TenQuyen']);
        $stmt->execute();
        return $this->getQuyenById($data['IdQuyen']);
    }
    
    // Cập nhật quyền
    public function updateQuyen($idQuyen, $tenQuyen) {
        $stmt = $this->db->prepare("UPDATE quyen SET TenQuyen = ? WHERE IdQuyen = ?");
        $stmt->bind_param("si", $tenQuyen, $idQuyen);
        return $stmt->execute();
    }

    // Xóa quyền (có thể thay đổi trạng thái nếu muốn xoá mềm)
    public function deleteQuyen($idQuyen) {
        $stmt = $this->db->prepare("DELETE FROM quyen WHERE IdQuyen = ?");
        $stmt->bind_param("i", $idQuyen);
        return $stmt->execute();
    }
}
?>
