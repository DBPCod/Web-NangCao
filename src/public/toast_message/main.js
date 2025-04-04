function toast({title='', message='', type='info', duration = 3000}) {
    const main = document.getElementById('toast');
    if (main) {
        const toast = document.createElement('div');

        // Tự động xóa sau duration + thời gian fade out
        const autoRemoveId = setTimeout(() => {
            main.removeChild(toast);
        }, duration + 1500); // Tăng thêm 1500ms để khớp với fadeOut mới

        // Xóa khi click
        toast.onclick = function(e) {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: 'fa-solid fa-circle-check',
            info: 'fa-solid fa-circle-info',
            warning: 'fa-solid fa-circle-exclamation',
            error: 'fa-solid fa-circle-exclamation'
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2); // Thời gian chờ trước khi fade out (giây)

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `appear ease-in-out 0.5s, fadeOut ease-in-out 1.5s ${delay}s forwards`;
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__message">${message}</p>
            </div>
            <div class="toast__close">   
                <i class="fa-solid fa-xmark"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}