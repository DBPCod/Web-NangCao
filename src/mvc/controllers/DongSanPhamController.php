<?php
include_once __DIR__ . '../../models/DongSanPhamModel.php';

class DongSanPhamController
{
    private $model;

    public function __construct()
    {
        $this->model = new DongSanPhamModel();
    }

    public function handleRequest()
    {
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
                $newDongSanPham = $this->model->addDongSanPham($input);
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
                        $input['SoLuong'],
                        $input['IdThuongHieu'],
                        $input['TrangThai']
                    );
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idDSP'])) {
                    $result = $this->model->deleteDongSanPham($_GET['idDSP']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }

    public function getModel()
    {
        return $this->model;
    }
}

(new DongSanPhamController())->handleRequest();
?>