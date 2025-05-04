<?php
include_once __DIR__ . '/../models/TaiKhoanModel.php';

class TaiKhoanController {
    private $model;

    public function __construct() {
        $this->model = new TaiKhoanModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['total'])) {
                    $data = $this->model->getTotalTaiKhoan();
                    echo json_encode(['total' => $data]);
                } elseif (isset($_GET['taikhoan'])) {
                    $data = $this->model->getTaiKhoanById($_GET['taikhoan']);
                    echo json_encode($data);
                } elseif (isset($_GET['idNguoiDung'])) {
                    $data = $this->model->getTaiKhoanByIdUser($_GET['idNguoiDung']);
                    echo json_encode($data);
                } else {
                    $data = $this->model->getAllTaiKhoan();
                    echo json_encode($data);
                }
                break;

            case 'POST':
                if (isset($input['taikhoan'])) {
                    $result = $this->model->GetPass($input);
                    if (password_verify($input["matkhau"], $result["MatKhau"])) {
                        echo json_encode([
                            "success" => true,
                            "message" => "Đúng mật khẩu!"
                        ]);
                    } else {
                        echo json_encode([
                            "success" => false,
                            "message" => "Sai mật khẩu!"
                        ]);
                    }
                } elseif (isset($input['taikhoan']) && isset($input['matkhau'])) {
                    $newTaiKhoan = $this->model->addTaiKhoan($input);
                    echo json_encode([
                        "message" => "Thêm tài khoản thành công",
                        "taiKhoan" => $newTaiKhoan
                    ]);
                }
                break;

            case 'PUT':
                if (isset($_GET['taikhoan'])) {
                    $result = $this->model->updateTaiKhoan($_GET['taikhoan'], $input);
                    echo json_encode([
                        "success" => $result,
                        "message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"
                    ]);
                } else {
                    echo json_encode(["message" => "Thiếu taikhoan để cập nhật"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idTaiKhoan'])) {
                    $result = $this->model->deleteTaiKhoan($_GET['idTaiKhoan']);
                    echo json_encode([
                        "message" => $result ? "Xóa thành công" : "Xóa thất bại"
                    ]);
                } else {
                    echo json_encode(["message" => "Thiếu IdTaiKhoan để xóa"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new TaiKhoanController())->handleRequest();
?>