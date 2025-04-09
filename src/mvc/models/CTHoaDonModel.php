<?php 
include_once '../core/DB.php';

class CTHoaDonModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllCTHoaDon() {
        $result = $this->db->query("SELECT * FROM cthoadon");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getCTHoaDonById($idHoaDon, $imei) {
        $stmt = $this->db->prepare("SELECT * FROM cthoadon WHERE IdHoaDon = ? AND Imei = ?");
        $stmt->bind_param("is", $idHoaDon, $imei);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addCTHoaDon($data) {
        $stmt = $this->db->prepare("INSERT INTO cthoadon (IdHoaDon, GiaTien, SoLuong, Imei) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("idis", $data['IdHoaDon'], $data['GiaTien'], $data['SoLuong'], $data['Imei']);
        $stmt->execute();
        return $this->getCTHoaDonById($data['IdHoaDon'], $data['Imei']);
    }

    // public function updateCTHoaDon($idHoaDon, $imei, $giaTien, $soLuong) {
    //     $stmt = $this->db->prepare("UPDATE cthoadon SET GiaTien = ?, SoLuong = ? WHERE IdHoaDon = ? AND Imei = ?");
    //     $stmt->bind_param("diis", $giaTien, $soLuong, $idHoaDon, $imei);
    //     return $stmt->execute();
    // }

    public function deleteCTHoaDon($idHoaDon, $imei) {
        $stmt = $this->db->prepare("DELETE FROM cthoadon WHERE IdHoaDon = ? AND Imei = ?");
        $stmt->bind_param("is", $idHoaDon, $imei);
        return $stmt->execute();
    }
}
?>
