// src/public/js/popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Đóng tất cả modal trước khi mở modal mới
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            modals.forEach(otherModal => {
                if (otherModal !== modal && otherModal.classList.contains('show')) {
                    const modalInstance = bootstrap.Modal.getInstance(otherModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });
        });
    });

    // Xử lý giỏ hàng
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.addEventListener('show.bs.modal', function () {
        const cartItems = document.querySelector('.cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        const cartItemCount = cartItems.children.length;

        if (cartItemCount === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
        }
    });

    document.querySelectorAll('.cart-item .btn-danger').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.cart-item').remove();
            const cartPopupInstance = bootstrap.Modal.getInstance(cartPopup);
            cartPopup.dispatchEvent(new Event('show.bs.modal'));
        });
    });
});