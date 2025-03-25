<?php
include_once __DIR__ . '/../models/NguoiDungModel.php';

class NguoiDungController {
    private $model;

    public function __construct() {
        $this->model = new NguoiDungModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idNguoiDung'])) {
                    $data = $this->model->getNguoiDungById($_GET['idNguoiDung']);
                } else {
                    $data = $this->model->getAllNguoiDung();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newUser = $this->model->addNguoiDung($input);
                echo json_encode([
                    "message" => "Thêm người dùng thành công",
                    "user" => $newUser
                ]);
                break;

            case 'PUT':
                // Đọc dữ liệu JSON từ input
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idNguoiDung'])) {
                    $result = $this->model->updateNguoiDung($_GET['idNguoiDung'], $_PUT);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu idNguoiDung"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idNguoiDung'])) {
                    $result = $this->model->deleteNguoiDung($_GET['idNguoiDung']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu idNguoiDung"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

// Khởi tạo và xử lý yêu cầu
(new NguoiDungController())->handleRequest();
?>
