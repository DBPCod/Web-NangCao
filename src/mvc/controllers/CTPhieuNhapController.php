<?php
include_once __DIR__ . '../../models/CTPhieuNhapModel.php';

class CTPhieuNhapController {
    private $model;

    public function __construct() {
        $this->model = new CTPhieuNhapModel();
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
                try {
                    $newCTPhieuNhap = $this->model->addCTPhieuNhap($input);
                    echo json_encode([
                        "message" => "Thêm chi tiết phiếu nhập thành công",
                        "ctPhieuNhap" => $newCTPhieuNhap
                    ]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(["message" => $e->getMessage()]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idPhieuNhap']) && isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $result = $this->model->deleteCTPhieuNhap($_GET['idPhieuNhap'], $_GET['idCHSP'], $_GET['idDSP']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Thiếu thông tin"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new CTPhieuNhapController())->handleRequest();
?>