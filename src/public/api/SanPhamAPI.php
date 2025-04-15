<?php
// smartstation/mvc/api/SanPhamAPI.php
include_once __DIR__ . '/../../mvc/models/CauHinhSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/SanPhamModel.php';

header("Content-Type: application/json");

class SanPhamAPI {
    private $cauHinhModel;
    private $sanPhamModel;

    public function __construct() {
        $this->cauHinhModel = new CauHinhSanPhamModel();
        $this->sanPhamModel = new SanPhamModel();
    }

    public function getProducts($page = 1, $limit = 6) {
        $offset = ($page - 1) * $limit;
        
        // Lấy danh sách cấu hình sản phẩm
        $cauHinhs = $this->cauHinhModel->getAllCauHinh();
        $sanPhams = $this->sanPhamModel->getAllProducts();
        
        // Kết hợp dữ liệu
        $products = array_map(function($cauHinh) use ($sanPhams) {
            $sanPham = array_filter($sanPhams, function($sp) use ($cauHinh) {
                return $sp['IdCHSP'] == $cauHinh['IdCHSP'];
            });
            $sanPham = reset($sanPham); // có thể là array hoặc false

            return [
                'idCHSP' => $cauHinh['IdCHSP'],
                'name' => $sanPham ? $sanPham['IdDongSanPham'] : null,  // Sửa tại đây
                'ram' => $cauHinh['Ram'],
                'rom' => $cauHinh['Rom'],
                'manHinh' => $cauHinh['ManHinh'],
                'pin' => $cauHinh['Pin'],
                'mauSac' => $cauHinh['MauSac'],
                'camera' => $cauHinh['Camera'],
                'trangThai' => $cauHinh['TrangThai'],
                'gia' => $sanPham ? $sanPham['Gia'] : null,              // Và ở đây
                'soLuong' => $sanPham ? $sanPham['SoLuong'] : 0,
                'image' => "/smartstation/src/public/img/ip16_4.png"
            ];

        }, $cauHinhs);

        // Phân trang
        $total = count($products);
        $products = array_slice($products, $offset, $limit);

        echo json_encode([
            'products' => $products,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ]);
    }
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
(new SanPhamAPI())->getProducts($page);
?>