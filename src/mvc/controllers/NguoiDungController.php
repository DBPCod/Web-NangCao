<?php
include_once __DIR__ . '/../models/NguoiDungModel.php';

class NguoiDungController {
    private $model;

    public function __construct() {
        $this->model = new NguoiDungModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idNguoiDung'])) {
                    $data = $this->model->getNguoiDungById($_GET['idNguoiDung']);
                } else {
                    $data = $this->model->getAllNguoiDung();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newUser = $this->model->addNguoiDung($input);
                echo json_encode([
                    "message" => "Thêm người dùng thành công",
                    "user" => $newUser
                ]);
                break;

            case 'PUT':
                if (isset($_GET['idNguoiDung'])) {
                    $idNguoiDung = $_GET['idNguoiDung'];
                    $currentUser = $this->model->getNguoiDungById($idNguoiDung);
                    if ($currentUser) {
                        // Chỉ cập nhật các trường được gửi, giữ nguyên các trường không gửi
                        $data = [
                            'HoVaTen' => $input['HoVaTen'] ?? $currentUser['HoVaTen'],
                            'Email' => $input['Email'] ?? $currentUser['Email'],
                            'DiaChi' => $input['DiaChi'] ?? $currentUser['DiaChi'],
                            'SoDienThoai' => $input['SoDienThoai'] ?? $currentUser['SoDienThoai'],
                            'TrangThai' => $input['TrangThai'] ?? $currentUser['TrangThai'],
                        ];
                        $result = $this->model->updateNguoiDung($idNguoiDung, $data); // Truyền trực tiếp $input
                        echo json_encode([
                            "success" => $result,
                            "message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"
                        ]);
                    } else {
                        echo json_encode(["message" => "Không tìm thấy người dùng"]);
                    }
                } else {
                    echo json_encode(["message" => "Thiếu idNguoiDung"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idNguoiDung'])) {
                    $result = $this->model->deleteNguoiDung($_GET['idNguoiDung']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu idNguoiDung"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new NguoiDungController())->handleRequest();
?>