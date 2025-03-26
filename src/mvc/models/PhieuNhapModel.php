<?php 
include_once '../core/DB.php';

class PhieuNhapModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllPhieuNhap() {
        $result = $this->db->query("SELECT * FROM phieunhap");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getPhieuNhapById($idPhieuNhap) {
        $stmt = $this->db->prepare("SELECT * FROM phieunhap WHERE IdPhieuNhap = ?");
        $stmt->bind_param("i", $idPhieuNhap);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addPhieuNhap($data) {
        $stmt = $this->db->prepare("INSERT INTO phieunhap (IdPhieuNhap, IdTaiKhoan, NgayNhap, TrangThai, IdNCC) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisii", $data['IdPhieuNhap'], $data['IdTaiKhoan'], $data['NgayNhap'], $data['TrangThai'], $data['IdNCC']);
        $stmt->execute();
        return $this->getPhieuNhapById($data['IdPhieuNhap']);
    }

    public function updatePhieuNhap($idPhieuNhap, $idTaiKhoan, $ngayNhap, $trangThai, $idNCC) {
        $stmt = $this->db->prepare("UPDATE phieunhap SET IdTaiKhoan = ?, NgayNhap = ?, TrangThai = ?, IdNCC = ? WHERE IdPhieuNhap = ?");
        $stmt->bind_param("isiii", $idTaiKhoan, $ngayNhap, $trangThai, $idNCC, $idPhieuNhap);
        return $stmt->execute();
    }

    public function deletePhieuNhap($idPhieuNhap) {
        $stmt = $this->db->prepare("UPDATE phieunhap SET TrangThai = 0 WHERE IdPhieuNhap = ?");
        $stmt->bind_param("i", $idPhieuNhap);
        return $stmt->execute();
    }
}
?>
