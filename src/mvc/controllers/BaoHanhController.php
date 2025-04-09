<?php 
include_once __DIR__ . '../../models/BaoHanhModel.php';

class BaohanhController {
    private $model;

    public function __construct() {
        $this->model = new BaohanhModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idBaoHanh'])) {
                    $data = $this->model->getWarrantyById($_GET['idBaoHanh']);
                } else {
                    $data = $this->model->getAllWarranties();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newWarranty = $this->model->addWarranty($input);
                
                echo json_encode([
                    "message" => "Thêm bảo hành thành công",
                    "warranty" => $newWarranty
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if(isset($_GET['idBaoHanh'])) {
                    $result = $this->model->updateWarranty($_PUT['IdBaoHanh'], $_PUT['ThoiGianBaoHanh'], $_PUT['TrangThai']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;

            case 'DELETE':
                if(isset($_GET['idBaoHanh'])) {
                    $result = $this->model->deleteWarranty($_GET['idBaoHanh']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new BaohanhController())->handleRequest();
?>
