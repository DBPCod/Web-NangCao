<?php
include_once __DIR__ . '/../models/HoaDonModel.php';

class HoaDonController {
    private $model;

    public function __construct() {
        $this->model = new HoaDonModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idHoaDon'])) {
                    $data = $this->model->getHoaDonById($_GET['idHoaDon']);
                } else {
                    $data = $this->model->getAllHoaDon();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newHoaDon = $this->model->addHoaDon($input);
                echo json_encode([
                    "message" => "Thêm hóa đơn thành công",
                    "HoaDon" => $newHoaDon
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idHoaDon'])) {
                    $result = $this->model->updateHoaDon($_GET['idHoaDon'], $_PUT);
                    echo json_encode([
                        "message" => $result ? "Cập nhật hóa đơn thành công" : "Cập nhật hóa đơn thất bại"
                    ]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idHoaDon'])) {
                    $result = $this->model->deleteHoaDon($_GET['idHoaDon']);
                    echo json_encode([
                        "message" => $result ? "Xóa hóa đơn thành công" : "Xóa hóa đơn thất bại"
                    ]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

// Khởi tạo controller và xử lý request
(new HoaDonController())->handleRequest();
?>
