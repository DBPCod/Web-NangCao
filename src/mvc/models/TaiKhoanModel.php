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
    public function getTaiKhoanById($taiKhoan) {
        $stmt = $this->db->prepare("SELECT * FROM TaiKhoan WHERE taiKhoan = ?");
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
        $hashedPassword = password_hash($data['MatKhau'], PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("UPDATE TaiKhoan SET MatKhau = ?, TrangThai = ? WHERE TaiKhoan = ?");
        $stmt->bind_param(
            "sis",
            $hashedPassword,
            $data['TrangThai'],
            $taiKhoan
        );
        return $stmt->execute();
    }

    // Xóa tài khoản (cập nhật trạng thái TrangThai = 0)
    public function deleteTaiKhoan($idTaiKhoan) {
        $stmt = $this->db->prepare("UPDATE TaiKhoan SET TrangThai = 0 WHERE IdTaiKhoan = ?");
        $stmt->bind_param("i", $idTaiKhoan);
        return $stmt->execute();
    }

    //check mật khẩu
    public function GetPass($input)
    {
        $stmt = $this->db->prepare("SELECT * FROM TaiKhoan WHERE taiKhoan = ?");
        $stmt->bind_param("s", $input["taikhoan"]);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
?>
