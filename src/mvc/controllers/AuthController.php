<?php
require_once '../models/AuthModel.php';

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

                        $user = $this->model->KiemTraTaiKhoan($username,$password);
                        if($user)
                        {
                            echo json_encode(["success" => true, "message" => "Đăng nhập thành công!"]);
                        }
                        else
                        {
                            echo json_encode(["success" => false, "message" => "Đăng nhập không thành công!"]);
                        }
                    }
            }
        }
    }

 (new AuthController())->handleRequest();
?>