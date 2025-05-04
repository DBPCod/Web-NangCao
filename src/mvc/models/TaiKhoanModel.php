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

    // Lấy tài khoản theo idnguoidung
    public function getTaiKhoanByIdUser($idNguoiDung) {
        $stmt = $this->db->prepare("SELECT * FROM TaiKhoan WHERE IdNguoiDung = ?");
        $stmt->bind_param("i", $idNguoiDung);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Lấy tài khoản theo IdTaiKhoan
    public function getTaiKhoanById($taiKhoan) {
        $stmt = $this->db->prepare("SELECT * FROM TaiKhoan WHERE TaiKhoan = ?");
        $stmt->bind_param("s", $taiKhoan);
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
    public function updateTaiKhoan($taiKhoan, $data) {
        if (isset($data['IdVaiTro'])) {
            $stmt = $this->db->prepare("UPDATE TaiKhoan SET IdVaiTro = ? WHERE TaiKhoan = ?");
            $stmt->bind_param("is", $data['IdVaiTro'], $taiKhoan);
            return $stmt->execute();
        } elseif (isset($data['MatKhau'])) {
            $hashedPassword = password_hash($data['MatKhau'], PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("UPDATE TaiKhoan SET MatKhau = ?, TrangThai = ? WHERE TaiKhoan = ?");
            $stmt->bind_param("sis", $hashedPassword, $data['TrangThai'], $taiKhoan);
            return $stmt->execute();
        }
        return false;
    }

    // Xóa tài khoản (cập nhật trạng thái TrangThai = 0)
    public function deleteTaiKhoan($idTaiKhoan) {
        $stmt = $this->db->prepare("UPDATE TaiKhoan SET TrangThai = 0 WHERE IdTaiKhoan = ?");
        $stmt->bind_param("i", $idTaiKhoan);
        return $stmt->execute();
    }

    // Check mật khẩu
    public function GetPass($taikhoan) {
        $stmt = $this->db->prepare("SELECT MatKhau FROM taikhoan WHERE TaiKhoan = ?");
        $stmt->bind_param("s", $taikhoan);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return null; // Trả về null nếu không tìm thấy tài khoản
        }
    }

    // Lấy tổng số tài khoản đang hoạt động
    public function getTotalTaiKhoan() {
        $result = $this->db->query("SELECT COUNT(*) as total FROM TaiKhoan WHERE TrangThai = 1");
        return $result->fetch_assoc()['total'];
    }
}
?>
