<?php
include_once __DIR__ . '/../models/SanPhamModel.php';

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
                    "message: " => "Them san pham thanh cong",
                    "product" => $newProduct
                ]);
                break;

            case 'PUT':
                //đổi sang kiểu đọc json
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if($_GET['idCHSP'] && $_GET['idDSP'])
                {
                    $result = $this->model->updateProduct($_PUT['IdCHSP'], $_PUT['IdDongSanPham'], $_PUT['SoLuong'], $_PUT['TrangThai']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;
            case 'DELETE':
                if(isset($_GET['idCHSP']) && $_GET['idDSP'])
                {
                    $result = $this->model->deleteProduct($_GET['idCHSP'],$_GET['idDSP']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;
            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}
(new SanPhamController())->handleRequest();
?>
