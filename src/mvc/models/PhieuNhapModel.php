<?php
include_once '../core/DB.php';

class PhieuNhapModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllPhieuNhap() {
        $result = $this->db->query("SELECT * FROM phieunhap WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getPhieuNhapById($idPhieuNhap) {
        $stmt = $this->db->prepare("SELECT * FROM phieunhap WHERE IdPhieuNhap = ?");
        $stmt->bind_param("i", $idPhieuNhap);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addPhieuNhap($data) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO phieunhap (IdTaiKhoan, NgayNhap, TrangThai, IdNCC, TongTien) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("isiid", $data['IdTaiKhoan'], $data['NgayNhap'], $data['TrangThai'], $data['IdNCC'], $data['TongTien']);
            $stmt->execute();
            $idPhieuNhap = $this->db->insert_id;
            $this->db->commit();
            return ['IdPhieuNhap' => $idPhieuNhap];
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm phiếu nhập: " . $e->getMessage());
        }
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