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
                if (isset($_GET['id'])) {
                    $data = $this->model->getProductById($_GET['id']);
                } else {
                    $data = $this->model->getAllProducts();
                }
                echo json_encode($data);
                break;

            // case 'POST':
            //     $result = $this->model->addProduct($input['name'], $input['price']);
            //     echo json_encode(["message" => $result ? "Thêm thành công" : "Thêm thất bại"]);
            //     break;

            // case 'PUT':
            //     parse_str(file_get_contents("php://input"), $_PUT);
            //     $result = $this->model->updateProduct($_GET['id'], $_PUT['name'], $_PUT['price']);
            //     echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
            //     break;

            // case 'DELETE':
            //     $result = $this->model->deleteProduct($_GET['id']);
            //     echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
            //     break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new SanPhamController())->handleRequest();
?>
