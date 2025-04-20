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

    public function getCTHoaDonById($idHoaDon) {
        $stmt = $this->db->prepare("
            SELECT 
                ct.Imei, 
                ct.GiaTien, 
                ct.SoLuong, 
                dsp.TenDong, 
                chsp.Ram, 
                chsp.Rom, 
                chsp.MauSac
            FROM cthoadon ct
            JOIN sanphamchitiet spct ON ct.Imei = spct.Imei
            JOIN cauhinhsanpham chsp ON spct.IdCHSP = chsp.IdCHSP
            JOIN dongsanpham dsp ON spct.IdDongSanPham = dsp.IdDongSanPham
            WHERE ct.IdHoaDon = ?
        ");
        $stmt->bind_param("i", $idHoaDon);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function addCTHoaDon($data) {
        $stmt = $this->db->prepare("INSERT INTO cthoadon (IdHoaDon, GiaTien, SoLuong, Imei) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("idis", $data['IdHoaDon'], $data['GiaTien'], $data['SoLuong'], $data['Imei']);
        $stmt->execute();
        return $this->getCTHoaDonById($data['IdHoaDon']);
    }

    public function deleteCTHoaDon($idHoaDon, $imei) {
        $stmt = $this->db->prepare("DELETE FROM cthoadon WHERE IdHoaDon = ? AND Imei = ?");
        $stmt->bind_param("is", $idHoaDon, $imei);
        return $stmt->execute();
    }
}