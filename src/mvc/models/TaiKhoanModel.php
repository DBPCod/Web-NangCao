<?php
include_once '../core/DB.php';

class TaiKhoanModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả tài khoản
    public function getAllTaiKhoan() {
        $result = $this->db->query("SELECT * FROM TaiKhoan");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy tài khoản theo IdTaiKhoan
    public function getTaiKhoanById($idTaiKhoan) {
        $stmt = $this->db->prepare("SELECT * FROM TaiKhoan WHERE IdTaiKhoan = ?");
        $stmt->bind_param("i", $idTaiKhoan);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm tài khoản mới
    public function addTaiKhoan($data) {
        $stmt = $this->db->prepare("INSERT INTO TaiKhoan (TaiKhoan, MatKhau, TrangThai, IdVaiTro, IdNguoiDung) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssiii",
            $data['TaiKhoan'],
            $data['MatKhau'],
            $data['TrangThai'],
            $data['IdVaiTro'],
            $data['IdNguoiDung']
        );
        $stmt->execute();
        return $this->getTaiKhoanById($this->db->insert_id);
    }

    // Cập nhật tài khoản
    public function updateTaiKhoan($idTaiKhoan, $data) {
        $stmt = $this->db->prepare("UPDATE TaiKhoan SET TaiKhoan = ?, MatKhau = ?, TrangThai = ?, IdVaiTro = ?, IdNguoiDung = ? WHERE IdTaiKhoan = ?");
        $stmt->bind_param(
            "ssiiii",
            $data['TaiKhoan'],
            $data['MatKhau'],
            $data['TrangThai'],
            $data['IdVaiTro'],
            $data['IdNguoiDung'],
            $idTaiKhoan
        );
        return $stmt->execute();
    }

    // Xóa tài khoản (cập nhật trạng thái TrangThai = 0)
    public function deleteTaiKhoan($idTaiKhoan) {
        $stmt = $this->db->prepare("UPDATE TaiKhoan SET TrangThai = 0 WHERE IdTaiKhoan = ?");
        $stmt->bind_param("i", $idTaiKhoan);
        return $stmt->execute();
    }
}
?>
