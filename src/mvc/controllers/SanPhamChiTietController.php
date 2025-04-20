<?php
include_once __DIR__ . '../../models/SanPhamChiTietModel.php';

class SanPhamChiTietController {
    private $model;

    public function __construct() {
        $this->model = new SanPhamChiTietModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['imei'])) {
                    $data = $this->model->getSanPhamChiTietByImei($_GET['imei']);
                    echo json_encode($data);
                } else if (isset($_GET['idCHSP']) && isset($_GET['idDongSanPham'])) {
                    try {
                        $data = $this->model->getAndLockSanPhamChiTietByCHSPandDSP($_GET['idCHSP'], $_GET['idDongSanPham']);
                        echo json_encode($data);
                    } catch (Exception $e) {
                        http_response_code(500);
                        echo json_encode(["message" => $e->getMessage()]);
                    }
                } else {
                    $data = $this->model->getAllSanPhamChiTiet();
                    echo json_encode($data);
                }
                break;

            case 'POST':
                try {
                    $newSanPhamChiTiet = $this->model->addSanPhamChiTiet($input);
                    echo json_encode([
                        "message" => "Thêm sản phẩm chi tiết thành công",
                        "sanphamchitiet" => $newSanPhamChiTiet
                    ]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(["message" => $e->getMessage()]);
                }
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if (isset($_GET['imei'])) {
                    try {
                        $result = $this->model->updateSanPhamChiTiet(
                            $_GET['imei'],
                            $_PUT['TrangThai'],
                            $_PUT['IdCHSP'],
                            $_PUT['IdDongSanPham'],
                            $_PUT['IdBaoHanh'],
                            $_PUT['IdPhieuNhap'] ?? null
                        );
                        echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                    } catch (Exception $e) {
                        http_response_code(500);
                        echo json_encode(["message" => $e->getMessage()]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Thiếu IMEI"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idPhieuNhap'])) {
                    try {
                        $result = $this->model->deleteSanPhamChiTiet($_GET['idPhieuNhap']);
                        echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                    } catch (Exception $e) {
                        http_response_code(500);
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

(new SanPhamChiTietController())->handleRequest();
?>