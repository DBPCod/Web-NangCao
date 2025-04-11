<?php
include_once __DIR__ . '../../models/DongSanPhamModel.php';

class DongSanPhamController {
    private $model;

    public function __construct() {
        $this->model = new DongSanPhamModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idDSP'])) {
                    $data = $this->model->getDongSanPhamById($_GET['idDSP']);
                } else {
                    $data = $this->model->getAllDongSanPham();
                }
                echo json_encode($data);
                break;

            case 'POST':
                if (!isset($input['TenDong']) || !isset($input['IdThuongHieu'])) {
                    echo json_encode(["message" => "Thiếu thông tin bắt buộc"]);
                    http_response_code(400);
                    return;
                }
                $newDongSanPham = $this->model->addDongSanPham([
                    'TenDong' => $input['TenDong'],
                    'SoLuong' => $input['SoLuong'] ?? 0,
                    'IdThuongHieu' => $input['IdThuongHieu'],
                    'TrangThai' => $input['TrangThai'] ?? 1
                ]);
                echo json_encode([
                    "message" => "Thêm dòng sản phẩm thành công",
                    "dongSanPham" => $newDongSanPham
                ]);
                break;

            case 'PUT':
                if (isset($_GET['idDSP'])) {
                    $result = $this->model->updateDongSanPham(
                        $_GET['idDSP'],
                        $input['TenDong'],
                        $input['SoLuong'] ?? 0,
                        $input['IdThuongHieu'],
                        $input['TrangThai'] ?? 1
                    );
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu ID dòng sản phẩm"]);
                    http_response_code(400);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idDSP'])) {
                    if ($this->model->isDongSanPhamInUse($_GET['idDSP'])) {
                        echo json_encode(["message" => "Không thể xóa dòng sản phẩm vì đang được sử dụng trong sản phẩm"]);
                        http_response_code(400);
                        return;
                    }
                    $result = $this->model->deleteDongSanPham($_GET['idDSP']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu ID dòng sản phẩm"]);
                    http_response_code(400);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
                http_response_code(405);
        }
    }

    public function getModel() {
        return $this->model;
    }
}

(new DongSanPhamController())->handleRequest();
?>