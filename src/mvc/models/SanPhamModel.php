<?php
include_once __DIR__ . '../../core/DB.php';

class SanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllProducts() {
        $result = $this->db->query("SELECT * FROM sanpham WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getProductById($idCHSP, $idDSP) {
        $stmt = $this->db->prepare("SELECT * FROM sanpham WHERE IdCHSP = ? AND IdDongSanPham = ?");
        $stmt->bind_param("ii", $idCHSP, $idDSP);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Hàm cập nhật số lượng trong dongsanpham dựa trên sanpham
    private function updateDongSanPhamQuantity($idDongSanPham) {
        $stmt = $this->db->prepare("
            SELECT SUM(SoLuong) as total 
            FROM sanpham 
            WHERE IdDongSanPham = ? AND TrangThai = 1
        ");
        $stmt->bind_param("i", $idDongSanPham);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $totalQuantity = $result['total'] ?? 0;

        $stmt = $this->db->prepare("
            UPDATE dongsanpham 
            SET SoLuong = ? 
            WHERE IdDongSanPham = ?
        ");
        $stmt->bind_param("ii", $totalQuantity, $idDongSanPham);
        $stmt->execute();
    }

    public function addProduct($data) {
        $this->db->begin_transaction();
        try {
            // Kiểm tra xem sản phẩm với IdCHSP và IdDongSanPham đã tồn tại chưa
            $stmt = $this->db->prepare("
                SELECT * FROM sanpham 
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("ii", $data['IdCHSP'], $data['IdDongSanPham']);
            $stmt->execute();
            $existingProduct = $stmt->get_result()->fetch_assoc();

            if ($existingProduct) {
                if ($existingProduct['TrangThai'] == 1) {
                    // Sản phẩm đã tồn tại và đang hoạt động
                    throw new Exception("Sản phẩm đã tồn tại và đang hoạt động.");
                } else {
                    // Sản phẩm tồn tại nhưng TrangThai = 0, cập nhật thành TrangThai = 1 và SoLuong = 0
                    $stmt = $this->db->prepare("
                        UPDATE sanpham 
                        SET TrangThai = 1,
                            SoLuong = 0,
                            Gia = ?
                        WHERE IdCHSP = ? AND IdDongSanPham = ?
                    ");
                    $gia = $data['Gia'] ?? $existingProduct['Gia'];
                    $stmt->bind_param("dii", $gia, $data['IdCHSP'], $data['IdDongSanPham']);
                    $stmt->execute();
                }
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới
                $stmt = $this->db->prepare("
                    INSERT INTO sanpham (IdCHSP, IdDongSanPham, SoLuong, Gia, TrangThai) 
                    VALUES (?, ?, ?, ?, ?)
                ");
                $gia = $data['Gia'] ?? 0;
                $trangThai = $data['TrangThai'] ?? 1;
                $soLuong = $data['SoLuong'] ?? 0;
                $stmt->bind_param("iiidi", $data['IdCHSP'], $data['IdDongSanPham'], $soLuong, $gia, $trangThai);
                $stmt->execute();
            }

            // Cập nhật số lượng trong dongsanpham
            $this->updateDongSanPhamQuantity($data['IdDongSanPham']);

            $this->db->commit();
            return $this->getProductById($data['IdCHSP'], $data['IdDongSanPham']);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception($e->getMessage());
        }
    }

    public function updateProduct($idCHSP, $idDSP, $soLuong, $gia, $trangThai) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("
                UPDATE sanpham 
                SET SoLuong = ?, Gia = ?, TrangThai = ? 
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("idiii", $soLuong, $gia, $trangThai, $idCHSP, $idDSP);
            $stmt->execute();

            // Cập nhật số lượng trong dongsanpham
            $this->updateDongSanPhamQuantity($idDSP);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi cập nhật sản phẩm: " . $e->getMessage());
        }
    }

    public function deleteProduct($idCHSP, $idDSP) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("
                UPDATE sanpham 
                SET TrangThai = 0 
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("ii", $idCHSP, $idDSP);
            $stmt->execute();

            // Cập nhật số lượng trong dongsanpham
            $this->updateDongSanPhamQuantity($idDSP);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi xóa sản phẩm: " . $e->getMessage());
        }
    }
}
?>