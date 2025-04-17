<?php 
include_once __DIR__ . '/../core/DB.php';

class CTKhuyenMaiModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllCTKhuyenMai() {
        $result = $this->db->query("SELECT * FROM ctkhuyenmai");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getCTKhuyenMaiById($idKhuyenMai, $idDongSanPham) {
        $stmt = $this->db->prepare("SELECT * FROM ctkhuyenmai WHERE IdKhuyenMai = ? AND IdDongSanPham = ?");
        $stmt->bind_param("ii", $idKhuyenMai, $idDongSanPham);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addCTKhuyenMai($data) {
        $stmt = $this->db->prepare("INSERT INTO ctkhuyenmai (IdKhuyenMai, IdDongSanPham) VALUES (?, ?)");
        $stmt->bind_param("is", $data['IdKhuyenMai'], $data['IdDongSanPham']);
        $stmt->execute();
        return $this->getCTKhuyenMaiById($data['IdKhuyenMai'], $data['IdDongSanPham']);
    }

    public function deleteCTKhuyenMai($idKhuyenMai, $idDongSanPham) {
        $stmt = $this->db->prepare("DELETE FROM ctkhuyenmai WHERE IdKhuyenMai = ? AND IdDongSanPham = ?");
        $stmt->bind_param("ii", $idKhuyenMai, $idDongSanPham);
        return $stmt->execute();
    }
}
?>