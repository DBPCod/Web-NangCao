<?php
include_once '../core/DB.php';

class NguoiDungModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả người dùng
    public function getAllNguoiDung() {
        $result = $this->db->query("SELECT * FROM nguoidung ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy người dùng theo ID
    public function getNguoiDungById($idNguoiDung) {
        $stmt = $this->db->prepare("SELECT * FROM nguoidung WHERE IdNguoiDung = ?");
        $stmt->bind_param("i", $idNguoiDung);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm mới người dùng
    public function addNguoiDung($data) {
        $stmt = $this->db->prepare("INSERT INTO nguoidung (HoVaTen, Email, DiaChi, SoDienThoai, TrangThai) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $data['HoVaTen'], $data['Email'], $data['DiaChi'], $data['SoDienThoai'], $data['TrangThai']);
        $stmt->execute();
        return $this->getNguoiDungById($this->db->insert_id);
    }

    // Cập nhật thông tin người dùng (chỉ cập nhật TrangThai nếu có trong $data)
    public function updateNguoiDung($idNguoiDung, $data) {
        // Nếu chỉ có TrangThai được truyền vào
        if (isset($data['TrangThai']) && count($data) === 1) {
            $stmt = $this->db->prepare("UPDATE nguoidung SET TrangThai = ? WHERE IdNguoiDung = ?");
            $stmt->bind_param("ii", $data['TrangThai'], $idNguoiDung);
            return $stmt->execute();
        } else {
            // Nếu có các trường khác, cập nhật đầy đủ
            $stmt = $this->db->prepare("UPDATE nguoidung SET HoVaTen = ?, Email = ?, DiaChi = ?, SoDienThoai = ?, TrangThai = ? WHERE IdNguoiDung = ?");
            $stmt->bind_param("ssssii", $data['HoVaTen'], $data['Email'], $data['DiaChi'], $data['SoDienThoai'], $data['TrangThai'], $idNguoiDung);
            return $stmt->execute();
        }
    }

    // Xóa người dùng (cập nhật trạng thái TrangThai = 0)
    public function deleteNguoiDung($idNguoiDung) {
        $stmt = $this->db->prepare("UPDATE nguoidung SET TrangThai = 0 WHERE IdNguoiDung = ?");
        $stmt->bind_param("i", $idNguoiDung);
        return $stmt->execute();
    }
}
?>