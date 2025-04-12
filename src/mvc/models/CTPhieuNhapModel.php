<?php
include_once '../core/DB.php';

class CTPhieuNhapModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllCTPhieuNhap() {
        $result = $this->db->query("SELECT * FROM ctphieunhap");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getCTPhieuNhapById($idPhieuNhap, $idCHSP, $idDSP) {
        $stmt = $this->db->prepare("SELECT * FROM ctphieunhap WHERE IdPhieuNhap = ? AND IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("iii", $idPhieuNhap, $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function getCTPhieuNhapByIdPN($idPhieuNhap) {
        $stmt = $this->db->prepare("SELECT * FROM ctphieunhap WHERE IdPhieuNhap = ?");
        $stmt->bind_param("i", $idPhieuNhap);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addCTPhieuNhap($data) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO ctphieunhap (IdPhieuNhap, GiaNhap, SoLuong, IdCHSP, IdDongSanPham) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("idiii", $data['IdPhieuNhap'], $data['GiaNhap'], $data['SoLuong'], $data['IdCHSP'], $data['IdDongSanPham']);
            $stmt->execute();
            $this->db->commit();
            return $this->getCTPhieuNhapById($data['IdPhieuNhap'], $data['IdCHSP'], $data['IdDongSanPham']);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm chi tiết phiếu nhập: " . $e->getMessage());
        }
    }

    public function deleteCTPhieuNhap($idPhieuNhap, $idCHSP, $idDSP) {
        $stmt = $this->db->prepare("DELETE FROM ctphieunhap WHERE IdPhieuNhap = ? AND IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("iii", $idPhieuNhap, $idCHSP, $idDSP);
        return $stmt->execute();
    }
}
?>