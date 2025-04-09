<?php 
include_once __DIR__ . '../../models/KhuyenMaiModel.php';

class KhuyenMaiController {
    private $model;

    public function __construct() {
        $this->model = new KhuyenMaiModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idKhuyenMai']) && isset($_GET['action']) && $_GET['action'] === 'getProductLines') {
                    $data = $this->model->getProductLinesByPromotion($_GET['idKhuyenMai']);
                } elseif (isset($_GET['idKhuyenMai'])) {
                    $data = $this->model->getKhuyenMaiById($_GET['idKhuyenMai']);
                } else {
                    $data = $this->model->getAllKhuyenMai();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newKhuyenMai = $this->model->addKhuyenMai($input);
                echo json_encode([
                    "message" => "Thêm khuyến mãi thành công",
                    "khuyenmai" => $newKhuyenMai // Trả về thông tin khuyến mãi, bao gồm IdKhuyenMai
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if (isset($_GET['idKhuyenMai'])) {
                    $result = $this->model->updateKhuyenMai(
                        $_GET['idKhuyenMai'], 
                        $_PUT['NgayBatDau'], 
                        $_PUT['NgayKetThuc'], 
                        $_PUT['PhanTramGiam'], 
                        $_PUT['TrangThai']
                    );
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idKhuyenMai'])) {
                    $result = $this->model->deleteKhuyenMai($_GET['idKhuyenMai']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new KhuyenMaiController())->handleRequest();
?>  