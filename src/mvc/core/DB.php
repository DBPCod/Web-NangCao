<?php
include "/xampp/htdocs/Web2/config.php";
//db_name, db_user, ... đã được cấu hình trong config.php
class DB{
    public $conn;
    public $servername = host_name;
    public $username = db_user;
    public $password = db_password;
    public $dbname = db_name;

    function __construct()
    {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        if($this->conn->connect_error)
        {
            die("Connection failed: " . $this->conn->connect_error);
        }
        $this->conn->set_charset("utf8");
    }

    public function getConnection() {
        return $this->conn;
    }
}

?>
