<?php
require_once '../models/AuthModel.php';
include_once '../models/SessionManager.php';
include_once '../models/CookieManager.php';

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
                        //xu ly dang nhap thu cong
                        $username = $input["username"];
                        $password = $input["password"];

                        //kiem tra tai khoan co ton tai hay khong?
                        if($this->model->KiemTraTaiKhoanTonTai($username))
                        {
                            $user = $this->model->KiemTraTaiKhoan($username,$password);                            
                            if($user)
                            {
                                echo json_encode(["success" => true, "message" => "Đăng nhập thành công!","user" => $user]);
                                
                                //luu vao session
                                SessionManager::start();
                                SessionManager::set('user',$user);

                                //luu vao cookie
                                if(CookieManager::get('username') === null)
                                {
                                    CookieManager::set('username',$username,3600 * 24 * 30);
                                }
                                
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
                        
                    }else if(isset($input['username']))
                    {
                        //xu ly dang nhap tu dong
                        $username = $input["username"];
                        if($this->model->KiemTraTaiKhoanTonTai($username))
                        {
                            $password = $this->model->GetMatKhau($username);
                            $user = $this->model->KiemTraTaiKhoan($username,$password);
                            if($user)
                            {
                                //luu vao session
                                SessionManager::start();
                                SessionManager::set('user',$user);

                                echo json_encode(["success" => true, "message" => "Đăng nhập thành công!","user" => $user]);
                            }
                            else{
                                echo json_encode(["success" => false, "message" => "Mật khẩu sai!","theloai" => "MATKHAU"]);
                            }
                        }
                    }else
                    {
                        //lây session đang hoạt động
                        SessionManager::start();
                        //hủy session
                        SessionManager::destroyAll();
                        //set lại thời gian hết hạn cho cookie
                        setcookie('username', '', time() - 3600, '/');
                        echo json_encode(["success" => true, "message" => "Đăng xuất thành công!"]);
                    }
            }
        }
    }

 (new AuthController())->handleRequest();
?>