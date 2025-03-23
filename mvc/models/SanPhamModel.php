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

    public function getProductById($id) {
        $stmt = $this->db->prepare("SELECT * FROM sanpham WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // public function addProduct($name, $price) {
    //     $stmt = $this->db->prepare("INSERT INTO sanpham (name, price) VALUES (?, ?)");
    //     $stmt->bind_param("sd", $name, $price);
    //     return $stmt->execute();
    // }

    // public function updateProduct($id, $name, $price) {
    //     $stmt = $this->db->prepare("UPDATE products SET name = ?, price = ? WHERE id = ?");
    //     $stmt->bind_param("sdi", $name, $price, $id);
    //     return $stmt->execute();
    // }

    // public function deleteProduct($id) {
    //     $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
    //     $stmt->bind_param("i", $id);
    //     return $stmt->execute();
    // }
}
?>
