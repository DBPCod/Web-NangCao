<?php
include_once '../core/DB.php';
include_once '../models/NguoiDungModel.php';
include_once '../models/TaiKhoanModel.php';
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

    //lay mat khau tu tai khoan

    public function GetMatKhau($username)
    {
        $stmt = $this->db->prepare("SELECT MatKhau FROM taikhoan where TaiKhoan = ?");
        $stmt->bind_param("s",$username);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc(); // Lấy kết quả truy vấn
        return $row ? $row["MatKhau"] : null; 
    }

    public function KiemTraTaiKhoan($username, $password)
    {
        $hahDB = $this->GetMatKhau($username);
            if(password_verify($password,$hahDB))
            {
                $stmt = $this->db->prepare("SELECT t.idnguoidung, n.hovaten, n.email 
                FROM taikhoan t 
                JOIN nguoidung n ON t.idnguoidung = n.idnguoidung 
                WHERE t.TaiKhoan = ?");
                $stmt->bind_param("s",$username);
                $stmt->execute();
                $row = $stmt->get_result()->fetch_assoc();
                return $row; 
            }
    }

    //lay thong tu dang nhap tự động
    public function GetInfo($username)
    {
                $stmt = $this->db->prepare("SELECT t.idnguoidung, n.hovaten, n.email 
                FROM taikhoan t 
                JOIN nguoidung n ON t.idnguoidung = n.idnguoidung 
                WHERE t.TaiKhoan = ?");
                $stmt->bind_param("s",$username);
                $stmt->execute();
                $row = $stmt->get_result()->fetch_assoc();
                return $row; 
    }

    public function AddAccount($input)
    {
        // Lấy từng giá trị từ mảng $input
        $username = isset($input['username']) ? $input['username'] : '';
        $password = isset($input['password']) ? $input['password'] : '';
        $fullName = isset($input['fullName']) ? $input['fullName'] : '';
        $phone = isset($input['phone']) ? $input['phone'] : '';
        $email = isset($input['email']) ? $input['email'] : '';
        $address = isset($input['address']) ? $input['address'] : '';

        $nguoidungModel = new NguoiDungModel();
        $data = [
            'HoVaTen' => $fullName,
            'Email' => $email,
            'DiaChi' => $address,
            'SoDienThoai' => $phone,
            'TrangThai' => 1  // Trạng thái người dùng (ví dụ: 1 cho active, 0 cho inactive)
        ];
        $user = $nguoidungModel->addNguoiDung($data);

        //IdTaiKhoan, TaiKhoan, MatKhau, TrangThai, IdVaiTro, IdNguoiDung
        $taikhoanModel = new TaiKhoanModel();

        $data1 = [     
            'TaiKhoan' => $username,           // Tên đăng nhập của tài khoản
            'MatKhau' => password_hash($password, PASSWORD_DEFAULT),        // Mật khẩu đã được băm (bằng password_hash)
            'TrangThai' => 1,                  // Trạng thái tài khoản (1 cho active, 0 cho inactive)
            'IdVaiTro' => 3,          // ID vai trò của tài khoản (ví dụ: 1 cho admin, 2 cho user)
            'IdNguoiDung' => $user['IdNguoiDung']     // ID người dùng (liên kết với bảng người dùng)
        ];
        return $taikhoanModel->addTaiKhoan($data1);
    }
}

?>