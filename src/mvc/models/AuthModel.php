<?php
include_once '../core/DB.php';
class AuthModel{
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    //kiem tra tai khoan co ton tai hay khong?
    public function KiemTraTaiKhoanTonTai($username)
    {
        $stmt = $this->db->prepare("SELECT * FROM taikhoan where TaiKhoan = ?");
        $stmt->bind_param("s",$username);
        $stmt->execute();
        $result = $stmt->get_result(); // Lấy kết quả truy vấn
        return $result->num_rows > 0; 
    }

    public function KiemTraTaiKhoan($username, $password)
    {
            $stmt = $this->db->prepare("SELECT t.idnguoidung, n.hovaten, n.email 
                FROM taikhoan t 
                JOIN nguoidung n ON t.idnguoidung = n.idnguoidung 
                WHERE t.TaiKhoan = ? AND t.MatKhau = ?");
            $stmt->bind_param("ss",$username,$password);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            return $row ? $row["hovaten"] : null; 
    }
}

?>