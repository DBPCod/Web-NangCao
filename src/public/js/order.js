// Function to format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}

// Function to calculate and update total price
function updateTotalPrice() {
    let total = 0;
    const productDetail = document.querySelectorAll('.product-details');
    if(productDetail.length!=0)
    {
        productDetail.forEach(product => {
            const price = parseInt(product.dataset.price);
            const quantity = parseInt(product.querySelector('.quantity-value').textContent);
            total += price * quantity;
        });
        document.getElementById('total-price').textContent = `Tổng tiền: ${formatPrice(total)}`;
    }
    
}

// Handle quantity selectors, delete, and details for all products
document.querySelectorAll('.product-details').forEach(product => {
    const quantityElement = product.querySelector('.quantity-value');
    const btnDecrement = product.querySelector('.btn-decrement');
    const btnIncrement = product.querySelector('.btn-increment');
    const deleteBtn = product.querySelector('.delete-btn');
    const detailsBtn = product.querySelector('.details-btn');

    function updateQuantityButtons(value) {
        btnDecrement.disabled = value <= 1;
        btnIncrement.disabled = value >= 10;
    }

    btnDecrement.addEventListener('click', () => {
        let value = parseInt(quantityElement.textContent);
        if (value > 1) {
            quantityElement.textContent = value - 1;
            updateQuantityButtons(value - 1);
            updateTotalPrice();
        }
    });

    btnIncrement.addEventListener('click', () => {
        let value = parseInt(quantityElement.textContent);
        if (value < 10) {
            quantityElement.textContent = value + 1;
            updateQuantityButtons(value + 1);
            updateTotalPrice();
        }
    });

    deleteBtn.addEventListener('click', () => {
        product.remove();
        updateTotalPrice();
        // If the deleted product was the one whose details were shown, clear the config section
        const configContainer = document.getElementById('config-container');
        if (configContainer.dataset.currentProduct === product.dataset.config) {
            configContainer.innerHTML = '<p>Chọn một sản phẩm để xem chi tiết cấu hình.</p>';
        }
    });

    detailsBtn.addEventListener('click', () => {
        const config = JSON.parse(product.dataset.config);
        const configContainer = document.getElementById('config-container');
        configContainer.innerHTML = ''; // Clear previous config
        configContainer.dataset.currentProduct = JSON.stringify(config); // Track the current product config

        for (const [label, value] of Object.entries(config)) {
            const configItem = document.createElement('div');
            configItem.className = 'config-item';
            configItem.innerHTML = `
                <span class="config-label">${label}</span>
                <span class="config-value">${value}</span>
            `;
            configContainer.appendChild(configItem);
        }
    });

    // Initial button state
    updateQuantityButtons(1);
});

// Initial total price calculation
updateTotalPrice();

const myModal = document.getElementById('myModal');

myModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Nút kích hoạt
    const actionType = button.getAttribute('data-title'); // Lấy giá trị data-title

    if (actionType === 'MuaNgay') {
        // Xử lý logic cho nút MUA NGAY
        console.log('Modal được mở từ MUA NGAY');
        // Ví dụ: hiện thông tin sản phẩm để mua luôn
    } else if (actionType === 'ThanhToan') {
        // Xử lý logic cho nút THANH TOÁN
        console.log('Modal được mở từ THANH TOÁN');
        // Ví dụ: hiện thông tin giỏ hàng để xác nhận
    }
});