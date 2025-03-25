<?php 
include_once '../core/DB.php';

class KhuyenMaiModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllKhuyenMai() {
        $result = $this->db->query("SELECT * FROM khuyenmai");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getKhuyenMaiById($idKhuyenMai) {
        $stmt = $this->db->prepare("SELECT * FROM khuyenmai WHERE IdKhuyenMai = ?");
        $stmt->bind_param("i", $idKhuyenMai);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addKhuyenMai($data) {
        $stmt = $this->db->prepare("INSERT INTO khuyenmai (IdKhuyenMai, NgayBatDau, NgayKetThuc, PhanTramGiam, TrangThai) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issii", $data['IdKhuyenMai'], $data['NgayBatDau'], $data['NgayKetThuc'], $data['PhanTramGiam'], $data['TrangThai']);
        $stmt->execute();
        return $this->getKhuyenMaiById($data['IdKhuyenMai']);
    }

    public function updateKhuyenMai($idKhuyenMai, $ngayBatDau, $ngayKetThuc, $phanTramGiam, $trangThai) {
        $stmt = $this->db->prepare("UPDATE khuyenmai SET NgayBatDau = ?, NgayKetThuc = ?, PhanTramGiam = ?, TrangThai = ? WHERE IdKhuyenMai = ?");
        $stmt->bind_param("ssiii", $ngayBatDau, $ngayKetThuc, $phanTramGiam, $trangThai, $idKhuyenMai);
        return $stmt->execute();
    }

    public function deleteKhuyenMai($idKhuyenMai) {
        $stmt = $this->db->prepare("UPDATE khuyenmai SET TrangThai = 0 WHERE IdKhuyenMai = ?");
        $stmt->bind_param("i", $idKhuyenMai);
        return $stmt->execute();
    }
} 
?>
