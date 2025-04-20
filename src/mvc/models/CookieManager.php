<?php
// CookieManager.php

class CookieManager {
    // Set cookie
    public static function set($name, $value, $expiry = 3600, $path = '/') {
        setcookie($name, $value, time() + $expiry, $path, "", false, false);
    }

    // Get cookie
    public static function get($name) {
        return isset($_COOKIE[$name]) ? $_COOKIE[$name] : null;
    }

    // Xóa cookie
    public static function destroy($name) {
        setcookie($name, "", time() - 3600, '/'); // Đặt thời gian hết hạn vào quá khứ để xóa cookie
    }
}
?>
