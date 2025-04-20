<?php
include_once __DIR__ . '/../models/CauHinhSanPhamModel.php';

class CauHinhSanPhamController {
    private $model;

    public function __construct() {
        $this->model = new CauHinhSanPhamModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idCHSP'])) {
                    $data = $this->model->getCauHinhById($_GET['idCHSP']);
                } else {
                    $data = $this->model->getAllCauHinh();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newConfig = $this->model->addCauHinh($input);
                echo json_encode([
                    "message" => "Thêm cấu hình sản phẩm thành công",
                    "cauHinhSanPham" => $newConfig
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $data = json_decode($json, true);

                if (isset($_GET['idCHSP'])) {
                    $result = $this->model->updateCauHinh($_GET['idCHSP'], $data);
                    echo json_encode([
                        "message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"
                    ]);
                } else {
                    echo json_encode(["message" => "Thiếu IdCHSP để cập nhật"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idCHSP'])) {
                    $result = $this->model->deleteCauHinh($_GET['idCHSP']);
                    echo json_encode([
                        "message" => $result ? "Xóa thành công (ẩn trạng thái)" : "Xóa thất bại"
                    ]);
                } else {
                    echo json_encode(["message" => "Thiếu IdCHSP để xóa"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
                break;
        }
    }
}

(new CauHinhSanPhamController())->handleRequest();
?>
