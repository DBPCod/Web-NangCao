<?php 
include_once '../core/DB.php';

class CTKhuyenMaiModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllCTKhuyenMai() {
        $result = $this->db->query("SELECT * FROM ctkhuyenmai");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getCTKhuyenMaiById($idKhuyenMai, $idCHSP, $idDSP) {
        $stmt = $this->db->prepare("SELECT * FROM ctkhuyenmai WHERE IdKhuyenMai = ? AND IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("iis", $idKhuyenMai, $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addCTKhuyenMai($data) {
        $stmt = $this->db->prepare("INSERT INTO ctkhuyenmai (IdKhuyenMai, IdCHSP, IdDongSanPham) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $data['IdKhuyenMai'], $data['IdCHSP'], $data['IdDongSanPham']);
        $stmt->execute();
        return $this->getCTKhuyenMaiById($data['IdKhuyenMai'], $data['IdCHSP'], $data['IdDongSanPham']);
    }

    // public function updateCTKhuyenMai($idKhuyenMai, $idCHSP, $idDSP) {
    //     $stmt = $this->db->prepare("UPDATE ctkhuyenmai SET IdCHSP = ?, IdDongSanPham = ? WHERE IdKhuyenMai = ? AND IdCHSP = ? AND IdDongSanPham = ?");
    //     $stmt->bind_param("isiis", $idKhuyenMai, $idCHSP, $idDSP);
    //     return $stmt->execute();
    // }

    public function deleteCTKhuyenMai($idKhuyenMai, $idCHSP, $idDSP) {
        $stmt = $this->db->prepare("DELETE FROM ctkhuyenmai WHERE IdKhuyenMai = ? AND IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("iis", $idKhuyenMai, $idCHSP, $idDSP);
        return $stmt->execute();
    }
} 
?>
