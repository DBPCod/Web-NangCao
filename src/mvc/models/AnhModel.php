<?php
include_once '../core/DB.php';
class AnhModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllAnh() {
        $result = $this->db->query("SELECT * FROM anh");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAnhById($idAnh) {
        $stmt = $this->db->prepare("SELECT * FROM anh WHERE IdAnh = ?");
        $stmt->bind_param("i", $idAnh);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addAnh($data) {
        $stmt = $this->db->prepare("INSERT INTO anh (IdAnh, Anh, IdCHSP, IdDongSanPham, TrangThai) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issis", $data['IdAnh'], $data['Anh'], $data['IdCHSP'], $data['IdDongSanPham'], $data['TrangThai']);
        $stmt->execute();
        return $this->getAnhById($data['IdAnh']);
    }

    public function updateAnh($idAnh, $anh, $idCHSP, $idDongSanPham, $trangThai) {
        $stmt = $this->db->prepare("UPDATE anh SET Anh = ?, IdCHSP = ?, IdDongSanPham = ?, TrangThai = ? WHERE IdAnh = ?");
        $stmt->bind_param("ssisi", $anh, $idCHSP, $idDongSanPham, $trangThai, $idAnh);
        return $stmt->execute();
    }

    public function deleteAnh($idAnh) {
        $stmt = $this->db->prepare("UPDATE anh SET TrangThai = ? WHERE IdAnh = ?");
        $TrangThai = 0;
        $stmt->bind_param("ii", $TrangThai, $idAnh);
        return $stmt->execute();
    }
}
?>