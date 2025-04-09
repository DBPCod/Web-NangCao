<?php
include_once __DIR__ . '../../models/CtphieunhapModel.php';

class CTPhieunhapController {
    private $model;

    public function __construct() {
        $this->model = new CtphieunhapModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idPhieuNhap']) && isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $data = $this->model->getCTPhieuNhapById($_GET['idPhieuNhap'], $_GET['idCHSP'], $_GET['idDSP']);
                } else {
                    $data = $this->model->getAllCTPhieuNhap();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newCTPhieuNhap = $this->model->addCTPhieuNhap($input);
                echo json_encode([
                    "message" => "Thêm CTPhieuNhap thành công",
                    "ctPhieuNhap" => $newCTPhieuNhap
                ]);
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new CTPhieunhapController())->handleRequest();
?>
