<?php
include_once __DIR__ . '/../models/ThuongHieuModel.php';

class ThuongHieuController {
    private $model;

    public function __construct() {
        $this->model = new ThuongHieuModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idThuongHieu'])) {
                    $data = $this->model->getThuongHieuById($_GET['idThuongHieu']);
                } else {
                    $data = $this->model->getAllThuongHieu();
                }
                echo json_encode($data);
                break;

            case 'POST':
                if (!empty($input['TenThuongHieu'])) {
                    $newBrand = $this->model->addThuongHieu($input['TenThuongHieu']);
                    echo json_encode([
                        "message" => "Thêm thương hiệu thành công",
                        "brand" => $newBrand
                    ]);
                } else {
                    echo json_encode(["message" => "Thiếu dữ liệu đầu vào"]);
                    http_response_code(400);
                }
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idThuongHieu']) && !empty($_PUT['TenThuongHieu'])) {
                    $result = $this->model->updateThuongHieu($_GET['idThuongHieu'], $_PUT['TenThuongHieu']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu dữ liệu hoặc ID không hợp lệ"]);
                    http_response_code(400);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idThuongHieu'])) {
                    if ($this->model->isThuongHieuInUse($_GET['idThuongHieu'])) {
                        echo json_encode(["message" => "Không thể xóa thương hiệu vì đang được sử dụng trong dòng sản phẩm"]);
                        http_response_code(400);
                        return;
                    }
                    $result = $this->model->deleteThuongHieu($_GET['idThuongHieu']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    echo json_encode(["message" => "ID không hợp lệ"]);
                    http_response_code(400);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
                http_response_code(405);
                break;
        }
    }
}

(new ThuongHieuController())->handleRequest();
?>