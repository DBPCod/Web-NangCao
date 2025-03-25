<?php
include_once '../core/DB.php';

class CTQuyenModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả dữ liệu CTQuyen
    public function getAllCtQuyen() {
        $result = $this->db->query("SELECT * FROM ctquyen");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy dữ liệu CTQuyen theo IdQuyen và IdVaiTro
    public function getCtQuyenByIdQuyen($idQuyen) {
        $stmt = $this->db->prepare("SELECT * FROM ctquyen WHERE IdQuyen = ?");
        $stmt->bind_param("i", $idQuyen);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy dữ liệu CTQuyen theo IdQuyen và IdVaiTro
    public function getCtQuyenByIdVaiTro($idVaiTro) {
        $stmt = $this->db->prepare("SELECT * FROM ctquyen WHERE IdVaiTro = ?");
        $stmt->bind_param("i", $idVaiTro);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }


    // Thêm mới CTQuyen
    public function addCtQuyen($data) {
        $stmt = $this->db->prepare("INSERT INTO ctquyen (IdQuyen, IdVaiTro) VALUES (?, ?)");
        $stmt->bind_param("ii", $data['IdQuyen'], $data['IdVaiTro']);
        $stmt->execute();
        return $this->getCtQuyenByIdQuyen($data['IdQuyen']);
    }

    // // Cập nhật CTQuyen
    // public function updateCtQuyen($idQuyen, $idVaiTro, $trangThai) {
    //     $stmt = $this->db->prepare("UPDATE CTQuyen SET TrangThai = ? WHERE IdQuyen = ? AND IdVaiTro = ?");
    //     $stmt->bind_param("iii", $trangThai, $idQuyen, $idVaiTro);
    //     return $stmt->execute();
    // }

    // Xóa CTQuyen (cập nhật trạng thái TrangThai = 0)
    // public function deleteCtQuyen($idQuyen, $idVaiTro) {
    //     $stmt = $this->db->prepare("UPDATE CTQuyen SET TrangThai = 0 WHERE IdQuyen = ? AND IdVaiTro = ?");
    //     $stmt->bind_param("ii", $idQuyen, $idVaiTro);
    //     return $stmt->execute();
    // }
}
?>
