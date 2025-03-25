<?php
include_once __DIR__ . '/../models/TinhTrangVanChuyenModel.php';

class TinhTrangVanChuyenController {
    private $model;

    public function __construct() {
        $this->model = new TinhTrangVanChuyenModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['id'])) {
                    $data = $this->model->getTinhTrangById($_GET['id']);
                } else {
                    $data = $this->model->getAllTinhTrang();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newStatus = $this->model->addTinhTrang($input);

                echo json_encode([
                    "message" => "Thêm trạng thái vận chuyển thành công!",
                    "status" => $newStatus
                ]);
                break;

            case 'PUT':
                // Đọc dữ liệu JSON từ input
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['id'])) {
                    $result = $this->model->updateTinhTrang($_GET['id'], $_PUT);
                    echo json_encode(["message" => $result ? "Cập nhật trạng thái thành công!" : "Cập nhật thất bại!"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['id'])) {
                    $result = $this->model->deleteTinhTrang($_GET['id']);
                    echo json_encode(["message" => $result ? "Xóa trạng thái thành công!" : "Xóa thất bại!"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ!"]);
        }
    }
}

// Khởi tạo controller và xử lý yêu cầu
(new TinhTrangVanChuyenController())->handleRequest();
?>
