<?php
include_once __DIR__ . '../../models/CtkhuyenmaiModel.php';

class CTKhuyenmaiController {
    private $model;

    public function __construct() {
        $this->model = new CtkhuyenmaiModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idKhuyenMai']) && isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $data = $this->model->getCTKhuyenMaiById($_GET['idKhuyenMai'], $_GET['idCHSP'], $_GET['idDSP']);
                } else {
                    $data = $this->model->getAllCTKhuyenMai();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newCTKhuyenMai = $this->model->addCTKhuyenMai($input);
                echo json_encode([
                    "message" => "Thêm CTKhuyenMai thành công",
                    "ctKhuyenMai" => $newCTKhuyenMai
                ]);
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new CTKhuyenmaiController())->handleRequest();
?>