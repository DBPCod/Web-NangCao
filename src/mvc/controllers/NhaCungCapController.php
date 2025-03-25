<?php
include_once __DIR__ . '/../models/NhaCungCapModel.php';

class NhaCungCapController {
    private $model;

    public function __construct() {
        $this->model = new NhaCungCapModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                // Lấy tất cả hoặc lấy theo IdNCC
                if (isset($_GET['idNCC'])) {
                    $data = $this->model->getNhaCungCapById($_GET['idNCC']);
                } else {
                    $data = $this->model->getAllNhaCungCap();
                }
                echo json_encode($data);
                break;

            case 'POST':
                // Thêm mới nhà cung cấp
                $newNCC = $this->model->addNhaCungCap($input);
                echo json_encode([
                    "message" => "Thêm nhà cung cấp thành công",
                    "nhaCungCap" => $newNCC
                ]);
                break;

            case 'PUT':
                // Cập nhật thông tin nhà cung cấp
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idNCC'])) {
                    $result = $this->model->updateNhaCungCap($_GET['idNCC'], $_PUT);
                    echo json_encode([
                        "message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"
                    ]);
                }
                break;

            case 'DELETE':
                // Xóa (cập nhật trạng thái) nhà cung cấp
                if (isset($_GET['idNCC'])) {
                    $result = $this->model->deleteNhaCungCap($_GET['idNCC']);
                    echo json_encode([
                        "message" => $result ? "Xóa thành công" : "Xóa thất bại"
                    ]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new NhaCungCapController())->handleRequest();
?>
