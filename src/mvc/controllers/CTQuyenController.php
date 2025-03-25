<?php
include_once __DIR__ . '/../models/CTQuyenModel.php';

class CTQuyenController {
    private $model;

    public function __construct() {
        $this->model = new CTQuyenModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idQuyen'])) {
                    $data = $this->model->getCtQuyenByIdQuyen($_GET['idQuyen']);
                } elseif (isset($_GET['idVaiTro'])) {
                    $data = $this->model->getCtQuyenByIdVaiTro($_GET['idVaiTro']);
                } else {
                    $data = $this->model->getAllCtQuyen();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newCtQuyen = $this->model->addCtQuyen($input);
                echo json_encode([
                    "message" => "Thêm CTQuyen thành công",
                    "ctQuyen" => $newCtQuyen
                ]);
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

// Khởi tạo controller và xử lý request
(new CTQuyenController())->handleRequest();
?>
