<?php 
include_once __DIR__ . '../../models/anhModel.php';

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
                } else {
                    $data = $this->model->getAllAnh();
                }
                echo json_encode($data);
                break;

            case 'POST':
                $newAnh = $this->model->addAnh($input);
                
                echo json_encode([
                    "message" => "Thêm ảnh thành công",
                    "anh" => $newAnh
                ]);
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);
                if(isset($_GET['idAnh'])) {
                    $result = $this->model->updateAnh($_PUT['IdAnh'], $_PUT['Anh'], $_PUT['IdCHSP'], $_PUT['IdDongSanPham'], $_PUT['TrangThai']);
                    echo json_encode(["message" => $result ? "Cập nhật thành công" : "Cập nhật thất bại"]);
                }
                break;

            case 'DELETE':
                if(isset($_GET['idAnh'])) {
                    $result = $this->model->deleteAnh($_GET['idAnh']);
                    echo json_encode(["message" => $result ? "Xóa thành công" : "Xóa thất bại"]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
        }
    }
}

(new AnhController())->handleRequest();
?>
