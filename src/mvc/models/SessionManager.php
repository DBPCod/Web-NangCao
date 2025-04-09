<?php
class SessionManager{
    public static function start()
    {
        if(session_status() == PHP_SESSION_NONE)
        {
            //khoi tao session
            session_start();
        }
    }

    //luu doi tuong vao session
    public static function set($key, $value)
    {
        $_SESSION[$key] = $value;
    }

    //lay gia tri tu session
    public static function get($key)
    {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
    }

    // Kiểm tra session có tồn tại hay không
    public static function exists($key) {
        return isset($_SESSION[$key]);
    }

    // Xóa session
    public static function destroy($key) {
        unset($_SESSION[$key]);
    }

    // Hủy tất cả session
    public static function destroyAll() {
        session_unset();
        session_destroy();
    }

}
?>