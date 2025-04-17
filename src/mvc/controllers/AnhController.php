<?php 
include_once __DIR__ . '../../models/AnhModel.php';

class AnhController {
    private $model;

    public function __construct() {
        $this->model = new AnhModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['idAnh'])) {
                    $data = $this->model->getAnhById($_GET['idAnh']);
                    if ($data && isset($data['Anh'])) {
                        $data['Anh'] = base64_encode($data['Anh']);
                    }
                } else if (isset($_GET['idCHSP']) && isset($_GET['idDSP'])) {
                    $data = $this->model->getAnhByCauHinhAndDongSanPham($_GET['idCHSP'], $_GET['idDSP']);
                    foreach ($data as &$anh) {
                        if (isset($anh['Anh'])) {
                            $anh['Anh'] = base64_encode($anh['Anh']);
                        }
                    }
                } else if (isset($_GET['idDSP'])) {
                    $data = $this->model->getAnhByDongSanPham($_GET['idDSP']);
                    foreach ($data as &$anh) {
                        if (isset($anh['Anh'])) {
                            $anh['Anh'] = base64_encode($anh['Anh']);
                        }
                    }
                } else {
                    $data = $this->model->getAllAnh();
                    foreach ($data as &$anh) {
                        if (isset($anh['Anh'])) {
                            $anh['Anh'] = base64_encode($anh['Anh']);
                        }
                    }
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newAnh = $this->model->addAnh($input);
                if ($newAnh && isset($newAnh['Anh'])) {
                    $newAnh['Anh'] = base64_encode($newAnh['Anh']);
                }
                echo json_encode([
                    "message" => "Thêm ảnh thành công",
                    "anh" => $newAnh
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if (isset($_GET['idAnh'])) {
                    $result = $this->model->updateAnh($_GET['idAnh'], $_PUT['Anh'], $_PUT['IdCHSP'], $_PUT['IdDongSanPham'], $_PUT['TrangThai']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu ID ảnh"]);
                    http_response_code(400);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idAnh'])) {
                    $result = $this->model->deleteAnh($_GET['idAnh']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                } else {
                    echo json_encode(["message" => "Thiếu ID ảnh"]);
                    http_response_code(400);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
                http_response_code(405);
        }
    }
}

(new AnhController())->handleRequest();
?>