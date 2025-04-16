<?php
include_once __DIR__ . '../../models/ThongKeModel.php';

class ThongKeController {
    private $model;

    public function __construct() {
        $this->model = new ThongKeModel();
    }

    public function handleRequest() {
        header("Content-Type: application/json");
        $method = $_SERVER["REQUEST_METHOD"];

        if ($method === 'GET') {
            $sort = $_GET['sort'] ?? 'desc';
            $sort = strtolower($sort) === 'asc' ? 'ASC' : 'DESC';

            // Nếu có mã hóa đơn thì lấy chi tiết hóa đơn
            if (isset($_GET['idHoaDon'])) {
                $data = $this->model->getChiTietHoaDon($_GET['idHoaDon']);
                echo json_encode($data);
                return;
            }

            if (isset($_GET['idNguoiDung'])) {
                $idNguoiDung = $_GET['idNguoiDung'];
                $from = $_GET['from'] ?? null;
                $to = $_GET['to'] ?? null;
            
                $hoaDonList = $this->model->getHoaDonByNguoiDung($idNguoiDung, $from, $to);
                echo json_encode($hoaDonList);
                return;
            }

            //Nếu nhập input thì lấy 5 người
            if (isset($_GET['from']) && isset($_GET['to'])) {
                $from = $_GET['from'];
                $to = $_GET['to'];
                $topUsers = $this->model->getTopUsersByDateRange($from, $to, $sort);
                echo json_encode($topUsers);
                exit;
            }

            // Mặc định: trả về top 5 khách hàng
            $data = $this->model->getTopKhachHang($sort);
            echo json_encode($data);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Phương thức không được hỗ trợ"]);
        }
    }
}

// Chạy controller
$controller = new ThongKeController();
$controller->handleRequest();
