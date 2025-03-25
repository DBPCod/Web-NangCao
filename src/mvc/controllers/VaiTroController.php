<?php
include_once __DIR__ . '/../models/VaiTroModel.php';

class VaiTroController {
    private $model;

    public function __construct() {
        $this->model = new VaiTroModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idVaiTro'])) {
                    $data = $this->model->getVaiTroById($_GET['idVaiTro']);
                } else {
                    $data = $this->model->getAllVaiTro();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newVaiTro = $this->model->addVaiTro($input);
                echo json_encode([
                    "message" => "Thêm vai trò thành công",
                    "vaitro" => $newVaiTro
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idVaiTro'])) {
                    $result = $this->model->updateVaiTro($_GET['idVaiTro'], $_PUT['TenVaiTro'], $_PUT['TrangThai']);
                    echo json_encode(["message" => $result ? "Cập nhật vai trò thành công" : "Cập nhật vai trò thất bại"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idVaiTro'])) {
                    $result = $this->model->deleteVaiTro($_GET['idVaiTro']);
                    echo json_encode(["message" => $result ? "Xóa vai trò thành công" : "Xóa vai trò thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new VaiTroController())->handleRequest();
?>
