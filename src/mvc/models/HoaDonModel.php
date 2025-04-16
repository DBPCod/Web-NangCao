<?php
include_once '../core/DB.php';

class HoaDonModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả hóa đơn
    public function getAllHoaDon() {
        $result = $this->db->query("SELECT * FROM hoadon");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy hóa đơn theo IdHoaDon
    public function getHoaDonById($idHoaDon) {
        $stmt = $this->db->prepare("SELECT * FROM hoadon WHERE IdHoaDon = ?");
        $stmt->bind_param("i", $idHoaDon);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm hóa đơn mới
    public function addHoaDon($data) {
        $stmt = $this->db->prepare("INSERT INTO hoadon (IdTaiKhoan, NgayTao, ThanhTien, TrangThai, IdTinhTrang) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isdis", $data['IdTaiKhoan'], $data['NgayTao'], $data['ThanhTien'], $data['TrangThai'], $data['IdTinhTrang']);
        $stmt->execute();
        return $this->getHoaDonById($this->db->insert_id);
    }

    // Cập nhật hóa đơn
    public function updateHoaDon($idHoaDon, $data) {
        $stmt = $this->db->prepare("UPDATE hoadon SET IdTaiKhoan = ?, NgayTao = ?, ThanhTien = ?, TrangThai = ?, IdTinhTrang = ? WHERE IdHoaDon = ?");
        $stmt->bind_param("isdisi", $data['IdTaiKhoan'], $data['NgayTao'], $data['ThanhTien'], $data['TrangThai'], $data['IdTinhTrang'], $idHoaDon);
        return $stmt->execute();
    }

    // Xóa hóa đơn (ẩn hóa đơn bằng cách thay đổi trạng thái)
    public function deleteHoaDon($idHoaDon) {
        $stmt = $this->db->prepare("UPDATE hoadon SET TrangThai = 0 WHERE IdHoaDon = ?");
        $stmt->bind_param("i", $idHoaDon);
        return $stmt->execute();
    }
}
?>
