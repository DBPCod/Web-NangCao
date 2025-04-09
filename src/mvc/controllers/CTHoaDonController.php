<?php
include_once __DIR__ . '../../models/CthoadonModel.php';

class CTHoadonController {
    private $model;

    public function __construct() {
        $this->model = new CthoadonModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idHoaDon']) && isset($_GET['imei'])) {
                    $data = $this->model->getCTHoaDonById($_GET['idHoaDon'], $_GET['imei']);
                } else {
                    $data = $this->model->getAllCTHoaDon();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newCTHoaDon = $this->model->addCTHoaDon($input);
                echo json_encode([
                    "message" => "Thêm CTHoaDon thành công",
                    "ctHoaDon" => $newCTHoaDon
                ]);
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new CTHoadonController())->handleRequest();
?>