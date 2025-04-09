<?php
include_once __DIR__ . '../../core/DB.php';
// include_once '../core/DB.php';

class SanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllProducts() {
        $result = $this->db->query("SELECT * FROM sanpham");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getProductById($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("SELECT * FROM sanpham WHERE IdCHSP = ? and IdDongSanPham = ?");
        $stmt->bind_param("is", $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addProduct($data)
    {
        $stmt = $this->db->prepare("INSERT into sanpham (IdCHSP, IdDongSanPham, SoLuong, TrangThai) values (?,?,?,?)");
        $stmt->bind_param("isii", $data['IdCHSP'], $data['IdDongSanPham'], $data['SoLuong'], $data['TrangThai']);
        $stmt->execute();
        return $this->getProductById($data['IdCHSP'], $data['IdDongSanPham']);
    }

    public function updateProduct($idCHSP, $idDSP, $soLuong, $trangThai) {
        $stmt = $this->db->prepare("UPDATE sanpham SET SoLuong = ?, TrangThai = ? WHERE IdCHSP = ? and IdDongSanPham = ?");
        $stmt->bind_param("iiis", $soLuong, $trangThai, $idCHSP, $idDSP);
        return $stmt->execute();
    }

    // public function deleteProduct($idCHSP, $idDSP) {
    //      $stmt = $this->db->prepare("DELETE FROM sanpham WHERE IdCHSP = ? and IdDongSanPham= ?");
    //      $stmt->bind_param("is", $idCHSP, $idDSP);
    //      return $stmt->execute();
    // }

    public function deleteProduct($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("UPDATE sanpham SET TrangThai = ? Where IdCHSP= ? and IdDongSanPham = ?");
        $TrangThai = 0;
        $stmt->bind_param("iis", $TrangThai, $idCHSP, $idDSP);
        return $stmt->execute();
    }
}
?>
