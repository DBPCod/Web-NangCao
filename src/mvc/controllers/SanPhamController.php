<?php
include_once __DIR__ . '../../models/SanPhamModel.php';

class SanPhamController {
    private $model;

    public function __construct() {
        $this->model = new SanPhamModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['total'])) {
                    $data = $this->model->getTotalProducts();
                    echo json_encode(['total' => $data]);
                } elseif (isset($_GET['priceRange'])) {
                    $data = $this->model->getPriceRange();
                    echo json_encode($data);
                } elseif (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $data = $this->model->getProductById($_GET['idCHSP'], $_GET['idDSP']);
                    echo json_encode($data);
                } elseif (isset($_GET['idDSP'])) {
                    $data = $this->model->getProductsByDongSanPham($_GET['idDSP']);
                    echo json_encode($data);
                } else {
                    $data = $this->model->getAllProducts();
                    echo json_encode($data);
                }
                break;

            case 'POST':
                try {
                    if (!isset($input['IdCHSP']) || !isset($input['IdDongSanPham'])) {
                        throw new Exception("Thiếu IdCHSP hoặc IdDongSanPham.");
                    }
                    $newProduct = $this->model->addProduct($input);
                    echo json_encode([
                        "message" => "Thêm hoặc kích hoạt sản phẩm thành công",
                        "product" => $newProduct
                    ]);
                } catch (Exception $e) {
                    http_response_code($e->getMessage() === "Sản phẩm đã tồn tại và đang hoạt động." ? 400 : 500);
                    echo json_encode(["message" => $e->getMessage()]);
                }
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    try {
                        $result = $this->model->updateProduct(
                            $_GET['idCHSP'],
                            $_GET['idDSP'],
                            $_PUT['SoLuong'],
                            $_PUT['Gia'],
                            $_PUT['TrangThai'],
                            $_PUT['NgayNhap']
                        );
                        echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                    } catch (Exception $e) {
                        http_response_code(500);
                        echo json_encode(["message" => $e->getMessage()]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Thiếu idCHSP hoặc idDSP"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $result = $this->model->deleteProduct($_GET['idCHSP'], $_GET['idDSP']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Thiếu idCHSP hoặc idDSP"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new SanPhamController())->handleRequest();
?>