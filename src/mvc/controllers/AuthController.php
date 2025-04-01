<?php
require_once '/xampp/htdocs/src/mvc/models/AuthModel.php';

    class AuthController{
        private $model;

        public function __construct() {
            $this->model = new AuthModel();
        }

        public function handleRequest()
        {
            header("Content-Type: application/json");
            $method = $_SERVER['REQUEST_METHOD'];
            $input = json_decode(file_get_contents('php://input'), true);
            switch($method)
            {
                case 'POST':
                    if(isset($input['username']) && isset($input['password']))
                    {
                        $username = $input["username"];
                        $password = $input["password"];

                        //kiem tra tai khoan co ton tai hay khong?
                        if($this->model->KiemTraTaiKhoanTonTai($username))
                        {
                            $user = $this->model->KiemTraTaiKhoan($username,$password);                            if($user)
                            {
                                echo json_encode(["success" => true, "message" => "Đăng nhập thành công!","user" => $user]);
                            }
                            else
                            {   
                                echo json_encode(["success" => false, "message" => "Mật khẩu sai!","theloai" => "MATKHAU"]);
                            }
                        }
                        else
                        {
                            echo json_encode(["success" => false, "message" => "Sai Tài khoản!","theloai" => "TAIKHOAN"]);
                        }
                        
                    }
            }
        }
    }

 (new AuthController())->handleRequest();
?>