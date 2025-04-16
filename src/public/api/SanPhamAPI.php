<?php
// smartstation/mvc/api/SanPhamAPI.php
include_once __DIR__ . '/../../mvc/models/CauHinhSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/SanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/DongSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/CTKhuyenMaiModel.php';
include_once __DIR__ . '/../../mvc/models/KhuyenMaiModel.php';
include_once __DIR__ . '/../../mvc/models/AnhModel.php';

header("Content-Type: application/json");

class SanPhamAPI {
    private $cauHinhModel;
    private $sanPhamModel;
    private $dongSanPhamModel;
    private $ctKhuyenMaiModel;
    private $khuyenMaiModel;
    private $anhModel;

    public function __construct() {
        $this->cauHinhModel = new CauHinhSanPhamModel();
        $this->sanPhamModel = new SanPhamModel();
        $this->dongSanPhamModel = new DongSanPhamModel();
        $this->ctKhuyenMaiModel = new CTKhuyenMaiModel();
        $this->khuyenMaiModel = new KhuyenMaiModel();
        $this->anhModel = new AnhModel();
    }

    public function getProducts($page = 1, $limit = 6) {
        $offset = ($page - 1) * $limit;
        
        // Lấy danh sách dữ liệu
        $cauHinhs = $this->cauHinhModel->getAllCauHinh();
        $sanPhams = $this->sanPhamModel->getAllProducts();
        $dongSanPhams = $this->dongSanPhamModel->getAllDongSanPham();
        $ctKhuyenMais = $this->ctKhuyenMaiModel->getAllCTKhuyenMai();
        $khuyenMais = $this->khuyenMaiModel->getAllKhuyenMai();

        // Tạo map từ IdCHSP đến CauHinh
        $cauHinhMap = [];
        foreach ($cauHinhs as $ch) {
            $cauHinhMap[$ch['IdCHSP']] = $ch;
        }

        // Tạo map từ IdDongSanPham đến TenDong
        $dongSanPhamMap = [];
        foreach ($dongSanPhams as $dsp) {
            $dongSanPhamMap[$dsp['IdDongSanPham']] = $dsp['TenDong'];
        }

        // Tạo map khuyến mãi: IdDongSanPham -> PhanTramGiam
        $khuyenMaiMap = [];
        $currentDate = date('Y-m-d');
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

        // Kết hợp dữ liệu, lặp qua sanPhams
        $products = array_map(function($sanPham) use ($cauHinhMap, $dongSanPhamMap, $khuyenMaiMap, $page) {
            $idCHSP = $sanPham['IdCHSP'];
            $idDongSanPham = $sanPham['IdDongSanPham'];

            // Lấy cấu hình tương ứng
            $cauHinh = isset($cauHinhMap[$idCHSP]) ? $cauHinhMap[$idCHSP] : null;
            if (!$cauHinh) {
                return null; // Bỏ qua nếu không có cấu hình
            }

            $productName = $idDongSanPham && isset($dongSanPhamMap[$idDongSanPham]) ? $dongSanPhamMap[$idDongSanPham] : 'Sản phẩm không xác định';
            
            $giaGoc = $sanPham['Gia'];
            $giaGiam = null;
            $phanTramGiam = null;

            if ($idDongSanPham && isset($khuyenMaiMap[$idDongSanPham]) && $giaGoc !== null) {
                $phanTramGiam = $khuyenMaiMap[$idDongSanPham]['phanTramGiam'];
                $giaGiam = $giaGoc * (1 - $phanTramGiam / 100);
            }

            // Lấy ảnh từ AnhModel
            $images = $this->anhModel->getAnhByCauHinhAndDongSanPham($idCHSP, $idDongSanPham);
            $image = !empty($images) && isset($images[0]['Anh']) ? base64_encode($images[0]['Anh']) : null;

            return [
                'idCHSP' => $idCHSP,
                'name' => $productName,
                'ram' => $cauHinh['Ram'] ?? 'N/A',
                'rom' => $cauHinh['Rom'] ?? 'N/A',
                'manHinh' => $cauHinh['ManHinh'] ?? 'N/A',
                'pin' => $cauHinh['Pin'] ?? 'N/A',
                'mauSac' => $cauHinh['MauSac'] ?? 'N/A',
                'camera' => $cauHinh['Camera'] ?? 'N/A',
                'trangThai' => $cauHinh['TrangThai'] ?? '0',
                'giaGoc' => $giaGoc,
                'giaGiam' => $giaGiam,
                'phanTramGiam' => $phanTramGiam,
                'soLuong' => $sanPham['SoLuong'],
                'image' => $image // Chuỗi base64 hoặc null
            ];
        }, $sanPhams);

        // Loại bỏ các sản phẩm null
        $products = array_filter($products, function($product) {
            return $product !== null;
        });

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