<?php
include_once '../core/DB.php';

class HoaDonModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllHoaDon($filters = []) {
        $query = "
            SELECT h.*, nd.HoVaTen 
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
            WHERE h.TrangThai = 1
        ";
        $params = [];
        $types = "";

        if (!empty($filters['tinhTrang'])) {
            $query .= " AND h.IdTinhTrang = ?";
            $params[] = $filters['tinhTrang'];
            $types .= "i";
        }
        if (!empty($filters['fromDate'])) {
            $query .= " AND h.NgayTao >= ?";
            $params[] = $filters['fromDate'];
            $types .= "s";
        }
        if (!empty($filters['toDate'])) {
            $query .= " AND h.NgayTao <= ?";
            $params[] = $filters['toDate'];
            $types .= "s";
        }
        if (!empty($filters['diaChi'])) {
            $query .= " AND nd.DiaChi LIKE ?";
            $params[] = "%" . $filters['diaChi'] . "%";
            $types .= "s";
        }

        // Add ORDER BY clause to sort by NgayTao in descending order
        $query .= " ORDER BY h.NgayTao DESC";

        $stmt = $this->db->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getHoaDonById($idHoaDon) {
        $stmt = $this->db->prepare("
            SELECT h.*, nd.HoVaTen 
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
            WHERE h.IdHoaDon = ?
        ");
        $stmt->bind_param("i", $idHoaDon);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function getHoaDonByNguoiDungWithPagination($idNguoiDung, $page = 1, $limit = 5, $statusId = null) {
        $offset = ($page - 1) * $limit;

        $query = "
            SELECT h.*, nd.HoVaTen 
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
            WHERE h.TrangThai = 1 AND nd.IdNguoiDung = ?
        ";
        $params = [$idNguoiDung];
        $types = "i";

        if ($statusId !== null) {
            $query .= " AND h.IdTinhTrang = ?";
            $params[] = $statusId;
            $types .= "i";
        }

        $query .= " ORDER BY h.NgayTao DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function countHoaDonByNguoiDung($idNguoiDung, $statusId = null) {
        $query = "
            SELECT COUNT(*) as total
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
            WHERE h.TrangThai = 1 AND nd.IdNguoiDung = ?
        ";
        $params = [$idNguoiDung];
        $types = "i";

        if ($statusId !== null) {
            $query .= " AND h.IdTinhTrang = ?";
            $params[] = $statusId;
            $types .= "i";
        }

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        return $result['total'];
    }

    public function getTotalRevenueThisMonth() {
        $result = $this->db->query("
            SELECT SUM(ThanhTien) as totalRevenue
            FROM hoadon
            WHERE TrangThai = 1 
            AND IdTinhTrang = 3
            AND YEAR(NgayTao) = YEAR(CURDATE())
            AND MONTH(NgayTao) = MONTH(CURDATE())
        ");
        $data = $result->fetch_assoc();
        return $data['totalRevenue'] ?? 0;
    }

    public function addHoaDon($data) {
        $this->db->begin_transaction();
        try {
            // Kiểm tra số lượng tồn kho
            $stmt = $this->db->prepare("
                SELECT SoLuong 
                FROM sanpham 
                WHERE IdCHSP = ? AND IdDongSanPham = ? AND TrangThai = 1
            ");
            $stmt->bind_param("ii", $data['IdCHSP'], $data['IdDongSanPham']);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            if (!$result || $result['SoLuong'] < $data['SoLuong']) {
                throw new Exception("Số lượng sản phẩm không đủ trong kho");
            }
    
            // Tiếp tục tạo hóa đơn
            $stmt = $this->db->prepare("
                INSERT INTO hoadon (IdTaiKhoan, NgayTao, ThanhTien, TrangThai, IdTinhTrang) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->bind_param("isdii", 
                $data['IdTaiKhoan'], 
                $data['NgayTao'], 
                $data['ThanhTien'], 
                $data['TrangThai'], 
                $data['IdTinhTrang']
            );
            $stmt->execute();
            $idHoaDon = $this->db->insert_id;
    
            // Cập nhật số lượng và đã bán
            $stmt = $this->db->prepare("
                UPDATE sanpham 
                SET SoLuong = SoLuong - ?, 
                    DaBan = DaBan + ? 
                WHERE IdCHSP = ? AND IdDongSanPham = ?
            ");
            $stmt->bind_param("iiii", 
                $data['SoLuong'], 
                $data['SoLuong'], 
                $data['IdCHSP'], 
                $data['IdDongSanPham']
            );
            $stmt->execute();
    
            if ($stmt->affected_rows === 0) {
                throw new Exception("Sản phẩm không tồn tại hoặc lỗi khi cập nhật kho");
            }
    
            // Cập nhật số lượng dòng sản phẩm
            $stmt = $this->db->prepare("
                UPDATE dongsanpham 
                SET SoLuong = (
                    SELECT SUM(SoLuong) 
                    FROM sanpham 
                    WHERE IdDongSanPham = ? AND TrangThai = 1
                )
                WHERE IdDongSanPham = ?
            ");
            $stmt->bind_param("ii", $data['IdDongSanPham'], $data['IdDongSanPham']);
            $stmt->execute();
    
            $this->db->commit();
            return $this->getHoaDonById($idHoaDon);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm hóa đơn: " . $e->getMessage());
        }
    }

    public function addMultiProductHoaDon($data) {
        $this->db->begin_transaction();
        try {
            // Kiểm tra số lượng tồn kho trước khi bắt đầu giao dịch
            foreach ($data['products'] as $product) {
                $stmt = $this->db->prepare("
                    SELECT SoLuong 
                    FROM sanpham 
                    WHERE IdCHSP = ? AND IdDongSanPham = ? AND TrangThai = 1
                ");
                $stmt->bind_param("ii", $product['IdCHSP'], $product['IdDongSanPham']);
                $stmt->execute();
                $result = $stmt->get_result()->fetch_assoc();
                
                if (!$result || $result['SoLuong'] < $product['SoLuong']) {
                    throw new Exception("Sản phẩm với IdCHSP: {$product['IdCHSP']} và IdDongSanPham: {$product['IdDongSanPham']} chỉ còn " . 
                        ($result ? $result['SoLuong'] : 0) . " trong kho, không đủ " . $product['SoLuong'] . " sản phẩm yêu cầu");
                }
            }

            // Tạo hóa đơn
            $stmt = $this->db->prepare("
                INSERT INTO hoadon (IdTaiKhoan, NgayTao, ThanhTien, TrangThai, IdTinhTrang) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->bind_param("isdii", 
                $data['IdTaiKhoan'], 
                $data['NgayTao'], 
                $data['ThanhTien'], 
                $data['TrangThai'], 
                $data['IdTinhTrang']
            );
            $stmt->execute();
            $idHoaDon = $this->db->insert_id;

            // Cập nhật số lượng sản phẩm
            foreach ($data['products'] as $product) {
                // Cập nhật số lượng
                $stmt = $this->db->prepare("
                    UPDATE sanpham 
                    SET SoLuong = SoLuong - ?, 
                        DaBan = DaBan + ? 
                    WHERE IdCHSP = ? AND IdDongSanPham = ? AND TrangThai = 1
                ");
                $stmt->bind_param("iiii", 
                    $product['SoLuong'], 
                    $product['SoLuong'], 
                    $product['IdCHSP'], 
                    $product['IdDongSanPham']
                );
                $stmt->execute();

                if ($stmt->affected_rows === 0) {
                    throw new Exception("Không thể cập nhật số lượng cho sản phẩm với IdCHSP: {$product['IdCHSP']} và IdDongSanPham: {$product['IdDongSanPham']}");
                }

                // Cập nhật tổng số lượng dòng sản phẩm
                $stmt = $this->db->prepare("
                    UPDATE dongsanpham 
                    SET SoLuong = (
                        SELECT SUM(SoLuong) 
                        FROM sanpham 
                        WHERE IdDongSanPham = ? AND TrangThai = 1
                    )
                    WHERE IdDongSanPham = ?
                ");
                $stmt->bind_param("ii", $product['IdDongSanPham'], $product['IdDongSanPham']);
                $stmt->execute();
            }

            $this->db->commit();
            return $this->getHoaDonById($idHoaDon);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi thêm hóa đơn nhiều sản phẩm: " . $e->getMessage());
        }
    }

    public function updateHoaDon($idHoaDon, $data) {
        $this->db->begin_transaction();
        try {
            $stmt = $this->db->prepare("UPDATE hoadon SET IdTinhTrang = ? WHERE IdHoaDon = ?");
            $stmt->bind_param("ii", $data['IdTinhTrang'], $idHoaDon);
            $stmt->execute();

            $newTinhTrang = $data['IdTinhTrang'];
            if ($newTinhTrang == 4) {
                $stmt = $this->db->prepare("
                    SELECT ct.Imei, ct.SoLuong, spct.IdCHSP, spct.IdDongSanPham
                    FROM cthoadon ct
                    JOIN sanphamchitiet spct ON ct.Imei = spct.Imei
                    WHERE ct.IdHoaDon = ?
                ");
                $stmt->bind_param("i", $idHoaDon);
                $stmt->execute();
                $ctHoaDons = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

                foreach ($ctHoaDons as $ct) {
                    $imei = $ct['Imei'];
                    $soLuong = $ct['SoLuong'];
                    $idCHSP = $ct['IdCHSP'];
                    $idDongSanPham = $ct['IdDongSanPham'];

                    $stmt = $this->db->prepare("
                        UPDATE sanpham 
                        SET SoLuong = SoLuong + ?
                        WHERE IdCHSP = ? AND IdDongSanPham = ?
                    ");
                    $stmt->bind_param("iii", $soLuong, $idCHSP, $idDongSanPham);
                    $stmt->execute();

                    $stmt = $this->db->prepare("
                        UPDATE sanpham 
                        SET DaBan = DaBan - ?
                        WHERE IdCHSP = ? AND IdDongSanPham = ?
                    ");
                    $stmt->bind_param("iii", $soLuong, $idCHSP, $idDongSanPham);
                    $stmt->execute();

                    $stmt = $this->db->prepare("
                        UPDATE dongsanpham 
                        SET SoLuong = (
                            SELECT SUM(SoLuong) 
                            FROM sanpham 
                            WHERE IdDongSanPham = ? AND TrangThai = 1
                        )
                        WHERE IdDongSanPham = ?
                    ");
                    $stmt->bind_param("ii", $idDongSanPham, $idDongSanPham);
                    $stmt->execute();
                }
            } elseif ($newTinhTrang == 3) {
                $stmt = $this->db->prepare("
                    UPDATE sanphamchitiet spct
                    JOIN cthoadon ct ON spct.Imei = ct.Imei
                    SET spct.TrangThai = 0
                    WHERE ct.IdHoaDon = ?
                ");
                $stmt->bind_param("i", $idHoaDon);
                $stmt->execute();
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi cập nhật hóa đơn: " . $e->getMessage());
        }
    }

    public function deleteHoaDon($idHoaDon) {
        $stmt = $this->db->prepare("UPDATE hoadon SET TrangThai = 0 WHERE IdHoaDon = ?");
        $stmt->bind_param("i", $idHoaDon);
        return $stmt->execute();
    }
}
?>
