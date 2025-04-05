<?php
include_once __DIR__ . '../../models/SanPhamModel.php';

class SanPhamController
{
    private $model;

    public function __construct()
    {
        $this->model = new SanPhamModel(); // Khởi tạo $model trong constructor
    }

    public function handleRequest()
    {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $data = $this->model->getProductById($_GET['idCHSP'], $_GET['idDSP']);
                } else {
                    $data = $this->model->getAllProducts();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newProduct = $this->model->addProduct($input);
                echo json_encode([
                    "message" => "Thêm sản phẩm thành công",
                    "product" => $newProduct
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $result = $this->model->updateProduct($_GET['idCHSP'], $_GET['idDSP'], $_PUT['SoLuong'], $_PUT['TrangThai']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $result = $this->model->deleteProduct($_GET['idCHSP'], $_GET['idDSP']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }

    // Thêm getter để truy cập $model từ bên ngoài nếu cần
    public function getModel()
    {
        return $this->model;
    }
}

(new SanPhamController())->handleRequest();
