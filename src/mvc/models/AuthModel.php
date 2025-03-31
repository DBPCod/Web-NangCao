<?php
include_once '../core/DB.php';
class AuthModel{
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function KiemTraTaiKhoan($username, $password)
    {
        $stmt = $this->db->prepare('SELECT IdNguoiDung FROM taikhoan WHERE TaiKhoan = ? and MatKhau = ?');
        $stmt->bind_param("ss",$username,$password);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        return $row ? $row["IdNguoiDung"] : null; 
    }
}

?>