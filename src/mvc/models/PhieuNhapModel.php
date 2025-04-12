<?php
include_once '../core/DB.php';

class PhieuNhapModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllPhieuNhap() {
        $result = $this->db->query("SELECT * FROM phieunhap WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getPhieuNhapById($idPhieuNhap) {
        $stmt = $this->db->prepare("SELECT * FROM phieunhap WHERE IdPhieuNhap = ?");
        $stmt->bind_param("i", $idPhieuNhap);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addPhieuNhap($data) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO phieunhap (IdTaiKhoan, NgayNhap, TrangThai, IdNCC, TongTien) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("isiid", $data['IdTaiKhoan'], $data['NgayNhap'], $data['TrangThai'], $data['IdNCC'], $data['TongTien']);
            $stmt->execute();
            $idPhieuNhap = $this->db->insert_id;
            $this->db->commit();
            return ['IdPhieuNhap' => $idPhieuNhap];
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm phiếu nhập: " . $e->getMessage());
        }
    }

    public function updatePhieuNhap($idPhieuNhap, $idTaiKhoan, $ngayNhap, $trangThai, $idNCC) {
        $stmt = $this->db->prepare("UPDATE phieunhap SET IdTaiKhoan = ?, NgayNhap = ?, TrangThai = ?, IdNCC = ? WHERE IdPhieuNhap = ?");
        $stmt->bind_param("isiii", $idTaiKhoan, $ngayNhap, $trangThai, $idNCC, $idPhieuNhap);
        return $stmt->execute();
    }

    public function deletePhieuNhap($idPhieuNhap) {
        $this->db->begin_transaction();
        try {
            // Kiểm tra xem có sản phẩm nào trong phiếu nhập đã được bán không
            $stmt = $this->db->prepare("
                SELECT COUNT(*) AS sold_count
                FROM sanphamchitiet spct
                INNER JOIN cthoadon cthd ON spct.Imei = cthd.Imei
                INNER JOIN hoadon hd ON cthd.IdHoaDon = hd.IdHoaDon
                WHERE spct.IdPhieuNhap = ? AND hd.TrangThai = 1
            ");
            $stmt->bind_param("i", $idPhieuNhap);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if ($result['sold_count'] > 0) {
                throw new Exception("Không thể xóa phiếu nhập vì có sản phẩm đã được bán.");
            }

            // Cập nhật số lượng trong bảng sanpham
            $stmt = $this->db->prepare("
                UPDATE sanpham sp
                INNER JOIN ctphieunhap cpn ON sp.IdCHSP = cpn.IdCHSP AND sp.IdDongSanPham = cpn.IdDongSanPham
                SET sp.SoLuong = GREATEST(sp.SoLuong - cpn.SoLuong, 0)
                WHERE cpn.IdPhieuNhap = ?
            ");
            $stmt->bind_param("i", $idPhieuNhap);
            $stmt->execute();

            // Xóa hoàn toàn các bản ghi trong sanphamchitiet
            $stmt = $this->db->prepare("DELETE FROM sanphamchitiet WHERE IdPhieuNhap = ?");
            $stmt->bind_param("i", $idPhieuNhap);
            $stmt->execute();

            // Đặt trạng thái ctphieunhap = 0
            // $stmt = $this->db->prepare("UPDATE ctphieunhap SET TrangThai = 0 WHERE IdPhieuNhap = ?");
            // $stmt->bind_param("i", $idPhieuNhap);
            // $stmt->execute();

            // Đặt trạng thái phieunhap = 0
            $stmt = $this->db->prepare("UPDATE phieunhap SET TrangThai = 0 WHERE IdPhieuNhap = ?");
            $stmt->bind_param("i", $idPhieuNhap);
            $stmt->execute();

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception($e->getMessage());
        }
    }
}
?>