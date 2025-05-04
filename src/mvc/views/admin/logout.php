<?php
    session_start();
    session_destroy();
    
    // Xóa cookie
    setcookie('admin_idnguoidung', '', time() - 3600, '/');
    setcookie('admin_hovaten', '', time() - 3600, '/');
    
    // Thêm header để ngăn cache
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    
    header("Location: login.php");
    exit();
?>
