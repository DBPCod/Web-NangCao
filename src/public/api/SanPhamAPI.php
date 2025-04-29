<?php
// smartstation/mvc/api/SanPhamAPI.php
include_once __DIR__ . '/../../mvc/models/CauHinhSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/SanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/DongSanPhamModel.php';
include_once __DIR__ . '/../../mvc/models/CTKhuyenMaiModel.php';
include_once __DIR__ . '/../../mvc/models/KhuyenMaiModel.php';
include_once __DIR__ . '/../../mvc/models/AnhModel.php';
include_once __DIR__ . '/../../mvc/models/ThuongHieuModel.php';

header("Content-Type: application/json");

class SanPhamAPI {
    private $cauHinhModel;
    private $sanPhamModel;
    private $dongSanPhamModel;
    private $ctKhuyenMaiModel;
    private $khuyenMaiModel;
    private $anhModel;
    private $thuongHieuModel;

    public function __construct() {
        try {
            $this->cauHinhModel = new CauHinhSanPhamModel();
            $this->sanPhamModel = new SanPhamModel();
            $this->dongSanPhamModel = new DongSanPhamModel();
            $this->ctKhuyenMaiModel = new CTKhuyenMaiModel();
            $this->khuyenMaiModel = new KhuyenMaiModel();
            $this->anhModel = new AnhModel();
            $this->thuongHieuModel = new ThuongHieuModel();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Lỗi khởi tạo: ' . $e->getMessage()]);
            exit;
        }
    }

    public function getProducts($page = 1, $limit = 6, $filters = []) {
        try {
            $offset = ($page - 1) * $limit;

            // Đọc và làm sạch tham số lọc
            $brands = isset($filters['brands']) && $filters['brands'] !== '' ? array_map('trim', explode(',', filter_var($filters['brands'], FILTER_SANITIZE_STRING))) : [];
            $priceRanges = isset($filters['priceRanges']) && $filters['priceRanges'] !== '' ? array_map('trim', explode(',', filter_var($filters['priceRanges'], FILTER_SANITIZE_STRING))) : [];
            $priceMin = isset($filters['priceMin']) && $filters['priceMin'] !== '' ? (float)filter_var($filters['priceMin'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null;
            $priceMax = isset($filters['priceMax']) && $filters['priceMax'] !== '' ? (float)filter_var($filters['priceMax'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null;
            $rams = isset($filters['rams']) && $filters['rams'] !== '' ? array_map('trim', explode(',', filter_var(urldecode($filters['rams']), FILTER_SANITIZE_STRING))) : [];
            $pins = isset($filters['pins']) && $filters['pins'] !== '' ? array_map('trim', explode(',', filter_var($filters['pins'], FILTER_SANITIZE_STRING))) : [];
            $searchQuery = isset($filters['q']) && $filters['q'] !== '' ? trim(filter_var($filters['q'], FILTER_SANITIZE_STRING)) : '';

            // Xử lý đặc biệt cho "12GB trở lên"
            $hasRam12GBPlus = in_array('12GB trở lên', $rams) || in_array('12GB+', $rams);
            if ($hasRam12GBPlus) {
                $rams = array_filter($rams, function($ram) {
                    return $ram !== '12GB trở lên' && $ram !== '12GB+';
                });
            }

            // Kiểm tra xem có bộ lọc nào được áp dụng không
            $hasFilters = !empty($brands) || !empty($priceRanges) || $priceMin !== null || $priceMax !== null || !empty($rams) || $hasRam12GBPlus || !empty($pins) || $searchQuery !== '';

            // Bước 1: Lấy toàn bộ dữ liệu cần thiết
            $sanPhams = $this->sanPhamModel->getAllProducts();
            $cauHinhs = $this->cauHinhModel->getAllCauHinh();
            $dongSanPhams = $this->dongSanPhamModel->getAllDongSanPham();
            $thuongHieus = $this->thuongHieuModel->getAllThuongHieu();
            $ctKhuyenMais = $this->ctKhuyenMaiModel->getAllCTKhuyenMai();
            $khuyenMais = $this->khuyenMaiModel->getAllKhuyenMai();

            // Tạo các map để tra cứu nhanh
            $cauHinhMap = [];
            foreach ($cauHinhs as $ch) {
                $cauHinhMap[$ch['IdCHSP']] = $ch;
            }

            $dongSanPhamMap = [];
            foreach ($dongSanPhams as $dsp) {
                $dongSanPhamMap[$dsp['IdDongSanPham']] = $dsp;
            }

            $thuongHieuMap = [];
            foreach ($thuongHieus as $th) {
                $thuongHieuMap[$th['IdThuongHieu']] = $th['TenThuongHieu'];
            }

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

            // Bước 2: Xây dựng mảng sản phẩm chứa toàn bộ thông tin
            $products = array_map(function($sanPham) use ($cauHinhMap, $dongSanPhamMap, $thuongHieuMap, $khuyenMaiMap) {
                $idCHSP = $sanPham['IdCHSP'];
                $idDongSanPham = $sanPham['IdDongSanPham'];

                // Lấy cấu hình
                $cauHinh = isset($cauHinhMap[$idCHSP]) ? $cauHinhMap[$idCHSP] : null;
                if (!$cauHinh) {
                    return null;
                }

                // Lấy thông tin dòng sản phẩm
                $dongSanPham = isset($dongSanPhamMap[$idDongSanPham]) ? $dongSanPhamMap[$idDongSanPham] : null;
                if (!$dongSanPham) {
                    return null;
                }

                // Lấy thương hiệu
                $idThuongHieu = $dongSanPham['IdThuongHieu'] ?? null;
                $tenThuongHieu = $idThuongHieu && isset($thuongHieuMap[$idThuongHieu]) ? $thuongHieuMap[$idThuongHieu] : null;

                // Tính giá gốc và giá giảm
                $giaGoc = $sanPham['Gia'];
                $giaGiam = null;
                $phanTramGiam = null;
                if ($idDongSanPham && isset($khuyenMaiMap[$idDongSanPham]) && $giaGoc !== null) {
                    $phanTramGiam = $khuyenMaiMap[$idDongSanPham]['phanTramGiam'];
                    $giaGiam = $giaGoc * (1 - $phanTramGiam / 100);
                }

                // Lấy ảnh
                $images = $this->anhModel->getAnhByCauHinhAndDongSanPham($idCHSP, $idDongSanPham);
                $image = !empty($images) && isset($images[0]['Anh']) ? base64_encode($images[0]['Anh']) : null;

                return [
                    'idCHSP' => $idCHSP,
                    'idDSP' => $idDongSanPham,
                    'name' => $dongSanPham['TenDong'] ?? 'Sản phẩm không xác định',
                    'ram' => $cauHinh['Ram'] ?? 'N/A',
                    'rom' => $cauHinh['Rom'] ?? 'N/A',
                    'manHinh' => $cauHinh['ManHinh'] ?? 'N/A',
                    'pin' => $cauHinh['Pin'] ?? 'N/A',
                    'mauSac' => $cauHinh['MauSac'] ?? 'N/A',
                    'camera' => $cauHinh['Camera'] ?? 'N/A',
                    'trangThai' => $sanPham['TrangThai'] ?? '0',
                    'giaGoc' => $giaGoc,
                    'giaGiam' => $giaGiam,
                    'phanTramGiam' => $phanTramGiam,
                    'soLuong' => $sanPham['SoLuong'],
                    'thuongHieu' => $tenThuongHieu,
                    'image' => $image
                ];
            }, $sanPhams);

            // Loại bỏ các sản phẩm null
            $products = array_filter($products, function($product) {
                return $product !== null;
            });
            $products = array_values($products);

            // Log số lượng sản phẩm ban đầu
            error_log('Initial products count: ' . count($products));

            // Bước 3: Lọc theo từ khóa tìm kiếm
            if ($hasFilters && $searchQuery) {
                $products = array_filter($products, function($product) use ($searchQuery) {
                    $searchLower = strtolower($searchQuery);
                    $nameLower = strtolower($product['name'] ?? '');
                    $brandLower = strtolower($product['thuongHieu'] ?? '');
                    return strpos($nameLower, $searchLower) !== false || strpos($brandLower, $searchLower) !== false;
                });
                $products = array_values($products);
                error_log('Products count after search filter: ' . count($products));
            }

            // Bước 4: Lọc theo thương hiệu (brands)
            if ($hasFilters && !empty($brands)) {
                $products = array_filter($products, function($product) use ($brands) {
                    return $product['thuongHieu'] && in_array($product['thuongHieu'], $brands);
                });
                $products = array_values($products);
                error_log('Products count after brands filter: ' . count($products));
            }

            //Lọc theo priceRanges
            // if ($hasFilters && !empty($priceRanges)) {
            //     $products = array_filter($products, function($product) use ($priceRanges) {
            //         $effectivePrice = $product['giaGiam'] !== null ? $product['giaGiam'] : $product['giaGoc'];
            //         foreach ($priceRanges as $range) {
            //             list($min, $max) = explode('-', $range);
            //             $min = (float)$min;
            //             $max = $max === '' ? PHP_INT_MAX : (float)$max;
            //             if ($effectivePrice >= $min && $effectivePrice <= $max) {
            //                 return true;
            //             }
            //         }
            //         return false;
            //     });
            //     $products = array_values($products);
            //     error_log('Products count after priceRanges filter: ' . count($products));
            // }

            // Lọc theo priceMin và priceMax
            if ($hasFilters && ($priceMin !== null || $priceMax !== null)) {
                $products = array_filter($products, function($product) use ($priceMin, $priceMax) {
                    $effectivePrice = $product['giaGiam'] !== null ? $product['giaGiam'] : $product['giaGoc'];
                    if ($priceMin !== null && $effectivePrice < $priceMin) {
                        return false;
                    }
                    if ($priceMax !== null && $effectivePrice > $priceMax) {
                        return false;
                    }
                    return true;
                });
                $products = array_values($products);
                error_log('Products count after priceMin/priceMax filter: ' . count($products));
            }

            // Bước 7: Lọc theo RAM
            if ($hasFilters && (!empty($rams) || $hasRam12GBPlus)) {
                $products = array_filter($products, function($product) use ($rams, $hasRam12GBPlus) {
                    $ramValue = isset($product['ram']) ? (int)preg_replace('/[^0-9]/', '', $product['ram']) : 0;
                    if (!empty($rams) && in_array($product['ram'], $rams)) {
                        return true;
                    }
                    if ($hasRam12GBPlus && $ramValue >= 12) {
                        return true;
                    }
                    return false;
                });
                $products = array_values($products);
                error_log('Products count after rams filter: ' . count($products));
            }

            // Bước 8: Lọc theo pin
            if ($hasFilters && !empty($pins)) {
                $products = array_filter($products, function($product) use ($pins) {
                    $pinValue = isset($product['pin']) ? (int)preg_replace('/[^0-9]/', '', $product['pin']) : 0;
                    foreach ($pins as $pinRange) {
                        list($min, $max) = explode('-', $pinRange);
                        $min = (int)$min;
                        $max = $max === '' ? PHP_INT_MAX : (int)$max;
                        if ($pinValue >= $min && $pinValue <= $max) {
                            return true;
                        }
                    }
                    return false;
                });
                $products = array_values($products);
                error_log('Products count after pins filter: ' . count($products));
            }

            // Log số lượng sản phẩm cuối cùng
            error_log('Final products count: ' . count($products));

            // Phân trang
            $total = count($products);
            $finalProducts = array_slice($products, $offset, $limit);

            echo json_encode([
                'products' => $finalProducts,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'message' => empty($finalProducts) ? 'Không có sản phẩm nào phù hợp' : ''
            ]);
        } catch (Exception $e) {
            error_log('Error in getProducts: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Lỗi xử lý yêu cầu: ' . $e->getMessage()]);
            exit;
        }
    }
}

// Đọc tham số từ query string
$page = isset($_GET['page']) ? (int)filter_var($_GET['page'], FILTER_SANITIZE_NUMBER_INT) : 1;
$filters = [
    'brands' => isset($_GET['brands']) ? filter_var($_GET['brands'], FILTER_SANITIZE_STRING) : '',
    'priceRanges' => isset($_GET['priceRanges']) ? filter_var($_GET['priceRanges'], FILTER_SANITIZE_STRING) : '',
    'priceMin' => isset($_GET['priceMin']) ? filter_var($_GET['priceMin'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null,
    'priceMax' => isset($_GET['priceMax']) ? filter_var($_GET['priceMax'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null,
    'rams' => isset($_GET['rams']) ? filter_var($_GET['rams'], FILTER_SANITIZE_STRING) : '',
    'pins' => isset($_GET['pins']) ? filter_var($_GET['pins'], FILTER_SANITIZE_STRING) : '',
    'q' => isset($_GET['q']) ? filter_var($_GET['q'], FILTER_SANITIZE_STRING) : ''
];

(new SanPhamAPI())->getProducts($page, 6, $filters);
?>