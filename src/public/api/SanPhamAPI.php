<?php
// smartstation/mvc/api/SanPhamAPI.php
include_once __DIR__ . '/../../mvc/models/CauHinhSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/SanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/DongSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/CTKhuyenMaiModel.php';
include_once __DIR__ . '/../../mvc/models/KhuyenMaiModel.php';

header("Content-Type: application/json");

class SanPhamAPI {
    private $cauHinhModel;
    private $sanPhamModel;
    private $dongSanPhamModel;
    private $ctKhuyenMaiModel;
    private $khuyenMaiModel;

    public function __construct() {
        $this->cauHinhModel = new CauHinhSanPhamModel();
        $this->sanPhamModel = new SanPhamModel();
        $this->dongSanPhamModel = new DongSanPhamModel();
        $this->ctKhuyenMaiModel = new CTKhuyenMaiModel();
        $this->khuyenMaiModel = new KhuyenMaiModel();
    }

    public function getProducts($page = 1, $limit = 6) {
        $offset = ($page - 1) * $limit;
        
        // Lấy danh sách cấu hình sản phẩm
        $cauHinhs = $this->cauHinhModel->getAllCauHinh();
        $sanPhams = $this->sanPhamModel->getAllProducts();
        $dongSanPhams = $this->dongSanPhamModel->getAllDongSanPham();
        $ctKhuyenMais = $this->ctKhuyenMaiModel->getAllCTKhuyenMai();
        $khuyenMais = $this->khuyenMaiModel->getAllKhuyenMai();

        // Tạo map từ IdDongSanPham đến TenDong
        $dongSanPhamMap = [];
        foreach ($dongSanPhams as $dsp) {
            $dongSanPhamMap[$dsp['IdDongSanPham']] = $dsp['TenDong'];
        }

        // Tạo map khuyến mãi: IdDongSanPham -> PhanTramGiam
        $khuyenMaiMap = [];
        $currentDate = date('Y-m-d');
        var_dump($currentDate);
        foreach ($ctKhuyenMais as $ctkm) {
            foreach ($khuyenMais as $km) {
                
                if ($ctkm['IdKhuyenMai'] == $km['IdKhuyenMai'] &&
                    $km['TrangThai'] == 1 &&
                    $currentDate >= $km['NgayBatDau'] &&
                    $currentDate <= $km['NgayKetThuc']) {
                    $khuyenMaiMap[$ctkm['IdDongSanPham']] = [
                        'phanTramGiam' => $km['PhanTramGiam'],
                        'idKhuyenMai' => $km['IdKhuyenMai']
                    ];
                }
            }
        }

        // Kết hợp dữ liệu
        $products = array_map(function($cauHinh) use ($sanPhams, $dongSanPhamMap, $khuyenMaiMap) {
            $sanPham = array_filter($sanPhams, function($sp) use ($cauHinh) {
                return $sp['IdCHSP'] == $cauHinh['IdCHSP'];
            });
            $sanPham = reset($sanPham); // có thể là array hoặc false

            $idDongSanPham = $sanPham ? $sanPham['IdDongSanPham'] : null;
            $productName = $idDongSanPham && isset($dongSanPhamMap[$idDongSanPham]) ? $dongSanPhamMap[$idDongSanPham] : 'Sản phẩm không xác định';
            
            $giaGoc = $sanPham ? $sanPham['Gia'] : null;
            $giaGiam = null;
            $phanTramGiam = null;
            var_dump($khuyenMaiMap);

            if ($idDongSanPham && isset($khuyenMaiMap[$idDongSanPham]) && $giaGoc !== null) {
                $phanTramGiam = $khuyenMaiMap[$idDongSanPham]['phanTramGiam'];
                $giaGiam = $giaGoc * (1 - $phanTramGiam / 100);
                var_dump($giaGiam);
            }

            return [
                'idCHSP' => $cauHinh['IdCHSP'],
                'name' => $productName,
                'ram' => $cauHinh['Ram'],
                'rom' => $cauHinh['Rom'],
                'manHinh' => $cauHinh['ManHinh'],
                'pin' => $cauHinh['Pin'],
                'mauSac' => $cauHinh['MauSac'],
                'camera' => $cauHinh['Camera'],
                'trangThai' => $cauHinh['TrangThai'],
                'giaGoc' => $giaGoc,
                'giaGiam' => $giaGiam,
                'phanTramGiam' => $phanTramGiam,
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