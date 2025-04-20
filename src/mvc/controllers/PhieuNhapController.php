<?php
include_once __DIR__ . '../../models/PhieuNhapModel.php';

class PhieuNhapController {
    private $model;

    public function __construct() {
        $this->model = new PhieuNhapModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idPhieuNhap'])) {
                    $data = $this->model->getPhieuNhapById($_GET['idPhieuNhap']);
                } else {
                    $data = $this->model->getAllPhieuNhap();
                }
                echo json_encode($data);
                break;

            case 'POST':
                try {
                    $newPhieuNhap = $this->model->addPhieuNhap($input);
                    echo json_encode([
                        "message" => "Thêm phiếu nhập thành công",
                        "phieuNhap" => $newPhieuNhap
                    ]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(["message" => $e->getMessage()]);
                }
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if (isset($_PUT['IdPhieuNhap'])) {
                    $result = $this->model->updatePhieuNhap(
                        $_PUT['IdPhieuNhap'], 
                        $_PUT['IdTaiKhoan'], 
                        $_PUT['NgayNhap'], 
                        $_PUT['TrangThai'], 
                        $_PUT['IdNCC']
                    );
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Thiếu IdPhieuNhap"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idPhieuNhap'])) {
                    try {
                        $result = $this->model->deletePhieuNhap($_GET['idPhieuNhap']);
                        echo json_encode(["message" => "Xóa phiếu nhập thành công"]);
                    } catch (Exception $e) {
                        http_response_code(400);
                        echo json_encode(["message" => $e->getMessage()]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Thiếu IdPhieuNhap"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new PhieuNhapController())->handleRequest();
?>