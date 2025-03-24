<?php
include_once '../core/DB.php';

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
        $stmt = $this->db->prepare("INSERT into sanpham (IdCHSP, IdDongSanPham, SoLuong) values (?,?,?)");
        $stmt->bind_param("isi", $data['IdCHSP'], $data['IdDongSanPham'], $data['SoLuong']);
        $stmt->execute();
        return $this->getProductById($data['IdCHSP'], $data['IdDongSanPham']);
    }

    // public function updateProduct($id, $name, $price) {
    //     $stmt = $this->db->prepare("UPDATE products SET name = ?, price = ? WHERE id = ?");
    //     $stmt->bind_param("sdi", $name, $price, $id);
    //     return $stmt->execute();
    // }

    public function deleteProduct($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("DELETE FROM sanpham WHERE IdCHSP = ? and IdDongSanPham= ?");
        $stmt->bind_param("is", $idCHSP, $idDSP);
        return $stmt->execute();
    }
}
?>
