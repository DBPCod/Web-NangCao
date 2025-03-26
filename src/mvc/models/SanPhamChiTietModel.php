<?php 
include_once '../core/DB.php';

class SanPhamChiTietModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllSanPhamChiTiet() {
        $result = $this->db->query("SELECT * FROM sanphamchitiet");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getSanPhamChiTietByImei($imei) {
        $stmt = $this->db->prepare("SELECT * FROM sanphamchitiet WHERE Imei = ?");
        $stmt->bind_param("s", $imei);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addSanPhamChiTiet($data) {
        $stmt = $this->db->prepare("INSERT INTO sanphamchitiet (Imei, TrangThai, IdCHSP, IdDongSanPham, IdBaoHanh) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("siiis", $data['Imei'], $data['TrangThai'], $data['IdCHSP'], $data['IdDongSanPham'], $data['IdBaoHanh']);
        $stmt->execute();
        return $this->getSanPhamChiTietByImei($data['Imei']);
    }

    public function updateSanPhamChiTiet($imei, $trangThai, $idCHSP, $idDongSanPham, $idBaoHanh) {
        $stmt = $this->db->prepare("UPDATE sanphamchitiet SET TrangThai = ?, IdCHSP = ?, IdDongSanPham = ?, IdBaoHanh = ? WHERE Imei = ?");
        $stmt->bind_param("iiiss", $trangThai, $idCHSP, $idDongSanPham, $idBaoHanh, $imei);
        return $stmt->execute();
    }

    public function deleteSanPhamChiTiet($imei) {
        $stmt = $this->db->prepare("UPDATE sanphamchitiet SET TrangThai = 0 WHERE Imei = ?");
        $stmt->bind_param("s", $imei);
        return $stmt->execute();
    }
}
?>

