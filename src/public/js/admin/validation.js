// Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm kiểm tra số điện thoại hợp lệ (10 số, bắt đầu bằng 0)
function isValidPhone(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}

// Hàm kiểm tra chuỗi không được để trống
function isNotEmpty(value) {
    return value && value.trim() !== '';
}

// Hàm kiểm tra số dương
function isPositiveNumber(value) {
    return !isNaN(value) && parseFloat(value) > 0;
}

// Hàm hiển thị thông báo lỗi
function showValidationError(message) {
    toast({
        title: "Cảnh báo",
        message: message,
        type: "warning",
        duration: 3000,
    });
    return false;
}