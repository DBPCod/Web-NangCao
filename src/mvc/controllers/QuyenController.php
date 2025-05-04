<?php
include_once __DIR__ . '/../models/QuyenModel.php';

class QuyenController {
    private $model;

    public function __construct() {
        $this->model = new QuyenModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idQuyen'])) {
                    $data = $this->model->getQuyenById($_GET['idQuyen']);
                } else {
                    $data = $this->model->getAllQuyen();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newQuyen = $this->model->addQuyen($input);

                echo json_encode([
                    "message" => "Thêm quyền thành công",
                    "quyen" => $newQuyen
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idQuyen'])) {
                    $result = $this->model->updateQuyen($_PUT['idQuyen'], $_PUT['TenQuyen']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idQuyen'])) {
                    $result = $this->model->deleteQuyen($_GET['idQuyen']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new QuyenController())->handleRequest();
?>
