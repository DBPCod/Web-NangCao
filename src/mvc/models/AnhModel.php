<?php
include_once '../core/DB.php';

class AnhModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllAnh() {
        $result = $this->db->query("SELECT * FROM anh WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAnhById($idAnh) {
        $stmt = $this->db->prepare("SELECT * FROM anh WHERE IdAnh = ?");
        $stmt->bind_param("i", $idAnh);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function getAnhByCauHinhAndDongSanPham($idCHSP, $idDongSanPham) {
        $stmt = $this->db->prepare("SELECT * FROM anh WHERE IdCHSP = ? AND IdDongSanPham = ? AND TrangThai = 1");
        $stmt->bind_param("ii", $idCHSP, $idDongSanPham);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function addAnh($data) {
        $stmt = $this->db->prepare("INSERT INTO anh (Anh, IdCHSP, IdDongSanPham, TrangThai) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("biii", $data['Anh'], $data['IdCHSP'], $data['IdDongSanPham'], $data['TrangThai']);
        $stmt->send_long_data(0, $data['Anh']); // Dùng send_long_data cho dữ liệu blob lớn
        $stmt->execute();
        return $this->getAnhById($this->db->insert_id);
    }

    public function updateAnh($idAnh, $anh, $idCHSP, $idDongSanPham, $trangThai) {
        $stmt = $this->db->prepare("UPDATE anh SET Anh = ?, IdCHSP = ?, IdDongSanPham = ?, TrangThai = ? WHERE IdAnh = ?");
        $stmt->bind_param("biiii", $anh, $idCHSP, $idDongSanPham, $trangThai, $idAnh);
        $stmt->send_long_data(0, $anh); // Dùng send_long_data cho dữ liệu blob lớn
        return $stmt->execute();
    }

    public function deleteAnh($idAnh) {
        $stmt = $this->db->prepare("UPDATE anh SET TrangThai = ? WHERE IdAnh = ?");
        $trangThai = 0;
        $stmt->bind_param("ii", $trangThai, $idAnh);
        return $stmt->execute();
    }
}
?>