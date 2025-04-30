<?php
include_once __DIR__ . '/../models/HoaDonModel.php';

class HoaDonController {
    private $model;

    public function __construct() {
        $this->model = new HoaDonModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                if (isset($_GET['totalRevenue'])) {
                    $data = $this->model->getTotalRevenueThisMonth();
                    echo json_encode(['totalRevenue' => $data]);
                } elseif (isset($_GET['idHoaDon'])) {
                    $data = $this->model->getHoaDonById($_GET['idHoaDon']);
                    echo json_encode($data);
                } elseif (isset($_GET['idNguoiDung'])) {
                    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
                    $statusId = isset($_GET['statusId']) ? (int)$_GET['statusId'] : null;
                    $orders = $this->model->getHoaDonByNguoiDungWithPagination($_GET['idNguoiDung'], $page, $limit, $statusId);
                    $total = $this->model->countHoaDonByNguoiDung($_GET['idNguoiDung'], $statusId);
                    echo json_encode([
                        'orders' => $orders,
                        'total' => $total
                    ]);
                } else {
                    $filters = [];
                    if (isset($_GET['tinhTrang']) && $_GET['tinhTrang'] !== '') {
                        $filters['tinhTrang'] = $_GET['tinhTrang'];
                    }
                    if (isset($_GET['fromDate']) && $_GET['fromDate'] !== '') {
                        $filters['fromDate'] = $_GET['fromDate'];
                    }
                    if (isset($_GET['toDate']) && $_GET['toDate'] !== '') {
                        $filters['toDate'] = $_GET['toDate'];
                    }
                    if (isset($_GET['diaChi']) && $_GET['diaChi'] !== '') {
                        $filters['diaChi'] = $_GET['diaChi'];
                    }
                    $data = $this->model->getAllHoaDon($filters);
                    echo json_encode($data);
                }
                break;

            case 'POST':
                if (isset($input['products']) && is_array($input['products'])) {
                    $newHoaDon = $this->model->addMultiProductHoaDon($input);
                    echo json_encode([
                        "message" => "Thêm hóa đơn nhiều sản phẩm thành công",
                        "HoaDon" => $newHoaDon
                    ]);
                } else {
                    $newHoaDon = $this->model->addHoaDon($input);
                    echo json_encode([
                        "message" => "Thêm hóa đơn thành công",
                        "HoaDon" => $newHoaDon
                    ]);
                }
                break;

            case 'PUT':
                $json = file_get_contents("php://input");
                $_PUT = json_decode($json, true);

                if (isset($_GET['idHoaDon'])) {
                    $result = $this->model->updateHoaDon($_GET['idHoaDon'], $_PUT);
                    echo json_encode([
                        "message" => $result ? "Cập nhật hóa đơn thành công" : "Cập nhật hóa đơn thất bại"
                    ]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['idHoaDon'])) {
                    $result = $this->model->deleteHoaDon($_GET['idHoaDon']);
                    echo json_encode([
                        "message" => $result ? "Xóa hóa đơn thành công" : "Xóa hóa đơn thất bại"
                    ]);
                }
                break;

            default:
                echo json_encode(["message" => "Yêu cầu không hợp lệ"]);
                http_response_code(405);
        }
    }
}

(new HoaDonController())->handleRequest();
?>