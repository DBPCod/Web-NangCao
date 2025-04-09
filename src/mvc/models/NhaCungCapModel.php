<?php
include_once '../core/DB.php';

class NhaCungCapModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllNhaCungCap() {
        $result = $this->db->query("SELECT * FROM NhaCungCap");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getNhaCungCapById($idNCC) {
        $stmt = $this->db->prepare("SELECT * FROM nhacungcap WHERE IdNCC = ?");
        $stmt->bind_param("i", $idNCC);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addNhaCungCap($data) {
        $stmt = $this->db->prepare("INSERT INTO nhacungcap (TenNCC, DiaChi, SoDienThoai, Email, TrangThai) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $data['TenNCC'], $data['DiaChi'], $data['SoDienThoai'], $data['Email'], $data['TrangThai']);
        $stmt->execute();
        return $this->getNhaCungCapById($this->db->insert_id);
    }

    public function updateNhaCungCap($idNCC, $data) {
        $stmt = $this->db->prepare("UPDATE nhacungcap SET TenNCC = ?, DiaChi = ?, SoDienThoai = ?, Email = ?, TrangThai = ? WHERE IdNCC = ?");
        $stmt->bind_param("sssssi", $data['TenNCC'], $data['DiaChi'], $data['SoDienThoai'], $data['Email'], $data['TrangThai'], $idNCC);
        return $stmt->execute();
    }

    public function deleteNhaCungCap($idNCC) {
        $stmt = $this->db->prepare("UPDATE nhacungcap SET TrangThai = 0 WHERE IdNCC = ?");
        $stmt->bind_param("i", $idNCC);
        return $stmt->execute();
    }
}
?>