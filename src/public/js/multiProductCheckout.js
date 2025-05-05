/**
 * Multi-product Checkout Module
 * Xử lý thanh toán nhiều sản phẩm từ giỏ hàng
 */

// DOM Elements
const checkoutModal = document.getElementById('checkoutModal');
const productList = checkoutModal.querySelector('#product-list');
let isQuantitySelectorsSetup = false;

// Thêm biến để theo dõi trạng thái thanh toán
let isProcessingMultiCheckout = false;

/**
 * Format price with commas (e.g., 30190000 -> 30,190,000 đ)
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}

/**
 * Parse formatted price (e.g., "30,190,000 đ" -> 30190000)
 * @param {string} formattedPrice - Formatted price string
 * @returns {number} Parsed price
 */
function parseFormattedPrice(formattedPrice) {
    try {
        if (!formattedPrice) throw new Error("Giá không được cung cấp");
        const cleanedPrice = formattedPrice.replace(/[,\.]/g, '').replace(/\s?VNĐ|đ/i, '').trim();
        const price = parseInt(cleanedPrice);
        if (isNaN(price)) throw new Error("Giá không hợp lệ");
        return price;
    } catch (error) {
        console.error("Lỗi khi phân tích giá:", error);
        return 0;
    }
}

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Get cookie value by name (alternative implementation)
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

/**
 * Update total price of all products
 */
function updateTotalPrice() {
    let total = 0;
    const products = productList.querySelectorAll('.product-details');
    products.forEach(product => {
        const price = parseFloat(product.dataset.price);
        const quantity = parseInt(product.querySelector('.quantity-value').textContent);
        total += price * quantity;
    });
    const totalPriceElement = checkoutModal.querySelector('#total-price-products');
    totalPriceElement.innerText = `Tổng tiền: ${formatPrice(total)}`;
}

/**
 * Update product quantity buttons based on current quantity and max stock
 * @param {HTMLElement} product - Product element
 * @param {number} currentQuantity - Current quantity
 * @param {number} maxStock - Maximum stock available
 */
function updateProductQuantityButtons(product, currentQuantity, maxStock) {
    const btnDecrement = product.querySelector('.btn-decrement');
    const btnIncrement = product.querySelector('.btn-increment');
    
    if (!btnDecrement || !btnIncrement) return;
    
    // Disable decrement button if quantity is 1
    btnDecrement.disabled = currentQuantity <= 1;
    
    // Disable increment button if quantity is at max stock
    btnIncrement.disabled = currentQuantity >= maxStock;
    
    // Add visual indication
    if (btnDecrement.disabled) {
        btnDecrement.classList.add('disabled');
    } else {
        btnDecrement.classList.remove('disabled');
    }
    
    if (btnIncrement.disabled) {
        btnIncrement.classList.add('disabled');
    } else {
        btnIncrement.classList.remove('disabled');
    }
}

/**
 * Fetch stock information for a product
 * @param {string} idCHSP - Product variant ID
 * @param {string} idDSP - Product line ID
 * @returns {Promise<number>} Stock quantity
 */
async function fetchStock(idCHSP, idDSP) {
    try {
        console.log(`Đang kiểm tra tồn kho cho sản phẩm: idCHSP=${idCHSP}, idDSP=${idDSP}`);
        const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}&idCHSP=${idCHSP}`);
        
        if (!response.ok) {
            console.error(`Lỗi khi kiểm tra tồn kho: ${response.status} ${response.statusText}`);
            throw new Error('Lỗi mạng khi lấy số lượng tồn kho');
        }
        
        const data = await response.json();
        console.log(`Kết quả kiểm tra tồn kho:`, data);
        
        // Trả về số lượng tồn kho
        return data.SoLuong !== undefined ? parseInt(data.SoLuong) : 10; // Mặc định là 10 nếu không có dữ liệu
    } catch (error) {
        console.error(`Lỗi khi lấy số lượng tồn kho cho sản phẩm idCHSP=${idCHSP}, idDSP=${idDSP}:`, error);
        return 10; // Mặc định là 10 nếu có lỗi
    }
}

/**
 * Setup product quantity selectors
 */
async function setupQuantitySelectors() {
    if (isQuantitySelectorsSetup) return;
    
    const products = productList.querySelectorAll('.product-details');
    if (products.length === 0) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Hiển thị thông báo đang kiểm tra tồn kho
    toast({
        title: "Đang xử lý",
        message: "Đang kiểm tra tồn kho sản phẩm...",
        type: "info",
        duration: 2000,
    });
    
    try {
        // Kiểm tra tồn kho cho từng sản phẩm
        for (const product of products) {
            const idCHSP = product.dataset.idchsp;
            const idDSP = product.dataset.iddsp;
            const productName = product.querySelector('h6').textContent;
            
            console.log(`Kiểm tra tồn kho cho sản phẩm "${productName}": idCHSP=${idCHSP}, idDSP=${idDSP}`);
            
            const maxStock = await fetchStock(idCHSP, idDSP);
            
            console.log(`Kết quả tồn kho cho sản phẩm "${productName}": ${maxStock}`);
            
            const btnDecrement = product.querySelector('.btn-decrement');
            const btnIncrement = product.querySelector('.btn-increment');
            const quantityElement = product.querySelector('.quantity-value');
            
            // Cập nhật số lượng ban đầu nếu vượt quá tồn kho
            let currentQuantity = parseInt(quantityElement.textContent);
            
            if (maxStock === 0) {
                // Sản phẩm hết hàng
                console.log(`Sản phẩm "${productName}" hết hàng (tồn kho = 0)`);
                product.classList.add('out-of-stock');
                quantityElement.textContent = "0";
                btnDecrement.disabled = true;
                btnIncrement.disabled = true;
                
                // Thêm thông báo hết hàng
                if (!product.querySelector('.out-of-stock-msg')) {
                    const outOfStockMsg = document.createElement('div');
                    outOfStockMsg.className = 'out-of-stock-msg';
                    outOfStockMsg.textContent = 'Hết hàng';
                    product.appendChild(outOfStockMsg);
                }
                
                // Cập nhật giỏ hàng
                cart = cart.filter(item => item.idCHSP !== idCHSP);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                toast({
                    title: "Thông báo",
                    message: `Sản phẩm "${productName}" đã hết hàng và đã được xóa khỏi giỏ hàng`,
                    type: "warning",
                    duration: 3000,
                });
            } else if (currentQuantity > maxStock) {
                console.log(`Sản phẩm "${productName}" vượt quá tồn kho: ${currentQuantity} > ${maxStock}`);
                quantityElement.textContent = maxStock;
                currentQuantity = maxStock;
                
                // Cập nhật giỏ hàng
                const cartItem = cart.find(item => item.idCHSP === idCHSP);
                if (cartItem) {
                    cartItem.quantity = maxStock;
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
                
                toast({
                    title: "Cảnh báo",
                    message: `Số lượng sản phẩm "${productName}" đã được điều chỉnh theo tồn kho (${maxStock})`,
                    type: "warning",
                    duration: 3000,
                });
            } else {
                console.log(`Sản phẩm "${productName}" còn hàng: ${currentQuantity} <= ${maxStock}`);
            }

            // Cập nhật trạng thái nút
            updateProductQuantityButtons(product, currentQuantity, maxStock);

            // Thay thế nút cũ bằng nút mới để tránh trùng lặp event listener
            const newBtnIncrement = btnIncrement.cloneNode(true);
            const newBtnDecrement = btnDecrement.cloneNode(true);
            btnIncrement.parentNode.replaceChild(newBtnIncrement, btnIncrement);
            btnDecrement.parentNode.replaceChild(newBtnDecrement, btnDecrement);

            // Thêm event listener cho nút tăng
            newBtnIncrement.addEventListener('click', () => {
                if (maxStock === 0) return;
                
                let value = parseInt(quantityElement.textContent);
                if (value < maxStock) {
                    quantityElement.textContent = value + 1;
                    updateProductQuantityButtons(product, value + 1, maxStock);
                    // Update quantity in localStorage
                    const cartItem = cart.find(item => item.idCHSP === idCHSP);
                    if (cartItem) {
                        cartItem.quantity = value + 1;
                        localStorage.setItem('cart', JSON.stringify(cart));
                    }
                    updateTotalPrice();
                }
            });

            // Thêm event listener cho nút giảm
            newBtnDecrement.addEventListener('click', () => {
                if (maxStock === 0) return;
                
                let value = parseInt(quantityElement.textContent);
                if (value > 1) {
                    quantityElement.textContent = value - 1;
                    updateProductQuantityButtons(product, value - 1, maxStock);
                    // Update quantity in localStorage
                    const cartItem = cart.find(item => item.idCHSP === idCHSP);
                    if (cartItem) {
                        cartItem.quantity = value - 1;
                        localStorage.setItem('cart', JSON.stringify(cart));
                    }
                    updateTotalPrice();
                }
            });
        }

        isQuantitySelectorsSetup = true;
    } catch (error) {
        console.error("Lỗi khi thiết lập bộ chọn số lượng:", error);
        toast({
            title: "Lỗi",
            message: "Không thể tải thông tin tồn kho. Vui lòng thử lại sau.",
            type: "error",
            duration: 3000,
        });
    }
}

/**
 * Setup product details display
 */
function setupProductDetails() {
    const products = productList.querySelectorAll('.product-details');
    products.forEach(product => {
        const detailsBtn = product.querySelector('.details-btn');
        
        if (!detailsBtn) {
            console.error('Không tìm thấy nút xem chi tiết trong sản phẩm');
            return;
        }
        
        // Xóa event listener cũ (nếu có)
        const newDetailsBtn = detailsBtn.cloneNode(true);
        detailsBtn.parentNode.replaceChild(newDetailsBtn, detailsBtn);
        
        newDetailsBtn.addEventListener('click', () => {
            try {
                const configStr = product.dataset.config;
                const config = configStr ? JSON.parse(configStr) : {};
                const configContainer = checkoutModal.querySelector('#config-container');
                let html = '<h6>Chi tiết cấu hình:</h6>';
                for (const [key, value] of Object.entries(config)) {
                    html += `
                        <div class="config-item">
                            <span class="config-label">${key}</span>
                            <span class="config-value">${value}</span>
                        </div>`;
                }
                configContainer.innerHTML = html;
            } catch (error) {
                console.error('Lỗi khi hiển thị chi tiết sản phẩm:', error);
                const configContainer = checkoutModal.querySelector('#config-container');
                configContainer.innerHTML = '<p>Không thể hiển thị chi tiết sản phẩm.</p>';
            }
        });
    });
}

/**
 * Setup product deletion
 */
function setupProductDeletion() {
    const products = productList.querySelectorAll('.product-details');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    products.forEach(product => {
        const deleteBtn = product.querySelector('.delete-btn');
        
        if (!deleteBtn) {
            console.error('Không tìm thấy nút xóa trong sản phẩm');
            return;
        }
        
        const idCHSP = product.dataset.idchsp;
        const productName = product.querySelector('h6').textContent;
        
        // Xóa event listener cũ (nếu có)
        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
        
        newDeleteBtn.addEventListener('click', () => {
            // Hiển thị xác nhận trước khi xóa
            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" khỏi giỏ hàng?`)) {
                product.remove();
                // Remove from localStorage
                cart = cart.filter(item => item.idCHSP !== idCHSP);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalPrice();
                
                if (productList.children.length === 0) {
                    checkoutModal.querySelector('#config-container').innerHTML = '<p>Không còn sản phẩm trong giỏ hàng.</p>';
                    
                    // Disable checkout button
                    const checkoutBtn = checkoutModal.querySelector('.checkout-btn');
                    if (checkoutBtn) {
                        checkoutBtn.disabled = true;
                        checkoutBtn.classList.add('disabled');
                    }
                }
                
                // Cập nhật số lượng sản phẩm trong giỏ hàng trên giao diện
                updateCartBadge();
            }
        });
    });
}

/**
 * Handle address input editability
 * @param {string} modalId - Modal ID
 */
function handleAddressInput(modalId) {
    const addressInput = document.getElementById(modalId === 'buyNowModal' ? 'address-input' : 'checkoutAddressInput');
    const editAddressRadio = document.getElementById(modalId === 'buyNowModal' ? 'edit-address' : 'checkoutEditAddress');

    // Xóa event listener cũ (nếu có)
    const newRadio = editAddressRadio.cloneNode(true);
    editAddressRadio.parentNode.replaceChild(newRadio, editAddressRadio);

    newRadio.addEventListener('change', () => {
        addressInput.disabled = !newRadio.checked;
        if (newRadio.checked) {
            addressInput.focus();
        }
    });
}

/**
 * Set user information in modal
 */
async function setUserInfo() {
    const idNguoiDung = getCookie('user');
    if (!idNguoiDung) {
        toast({
            title: "Lỗi",
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
            type: "error",
            duration: 3000,
        });
        return;
    }
    
    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`);
        if (!response.ok) {
            throw new Error(`Lỗi mạng: ${response.status}`);
        }
        
        const userData = await response.json();
        document.getElementById('checkoutTel').value = userData.SoDienThoai || '';
        document.getElementById('checkoutFullName').value = userData.HoVaTen || '';
        document.getElementById('checkoutEmail').value = userData.Email || '';
        document.getElementById('checkoutAddressInput').value = userData.DiaChi || '';
        
        // Kiểm tra nếu địa chỉ trống
        if (!userData.DiaChi) {
            toast({
                title: "Thông báo",
                message: "Vui lòng cập nhật địa chỉ giao hàng của bạn",
                type: "info",
                duration: 3000,
            });
            
            // Tự động chọn radio button chỉnh sửa địa chỉ
            const editAddressRadio = document.getElementById('checkoutEditAddress');
            if (editAddressRadio) {
                editAddressRadio.checked = true;
                document.getElementById('checkoutAddressInput').disabled = false;
                document.getElementById('checkoutAddressInput').focus();
            }
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        toast({
            title: "Lỗi",
            message: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
            type: "error",
            duration: 3000,
        });
    }
}

/**
 * Get account ID from TaiKhoanController
 * @param {string} idNguoiDung - User ID
 * @returns {Promise<string>} Account ID
 */
async function getIdTaiKhoan(idNguoiDung) {
    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/TaiKhoanController.php?idNguoiDung=${idNguoiDung}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`Lỗi mạng: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.IdTaiKhoan) {
            return data.IdTaiKhoan;
        }
        throw new Error("Không tìm thấy IdTaiKhoan cho IdNguoiDung: " + idNguoiDung);
    } catch (error) {
        console.error("Lỗi khi lấy ID tài khoản:", error);
        throw new Error("Không thể lấy thông tin tài khoản: " + error.message);
    }
}

/**
 * Validate checkout form
 * @returns {boolean} True if form is valid
 */
function validateCheckoutForm() {
    const fullName = document.getElementById('checkoutFullName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const tel = document.getElementById('checkoutTel').value.trim();
    const address = document.getElementById('checkoutAddressInput').value.trim();
    
    if (!fullName) {
        toast({
            title: "Lỗi",
            message: "Vui lòng nhập họ và tên",
            type: "error",
            duration: 3000,
        });
        return false;
    }
    
    if (!email) {
        toast({
            title: "Lỗi",
            message: "Vui lòng nhập email",
            type: "error",
            duration: 3000,
        });
        return false;
    }
    
    if (!tel) {
        toast({
            title: "Lỗi",
            message: "Vui lòng nhập số điện thoại",
            type: "error",
            duration: 3000,
        });
        return false;
    }
    
    if (!address) {
        toast({
            title: "Lỗi",
            message: "Vui lòng nhập địa chỉ giao hàng",
            type: "error",
            duration: 3000,
        });
        return false;
    }
    
    return true;
}

/**
 * Handle multi-product checkout
 */
async function handleMultiProductCheckout() {
    // Ngăn chặn nhiều lần nhấn
    if (isProcessingMultiCheckout) {
        return;
    }
    
    // Validate form
    if (!validateCheckoutForm()) {
        return;
    }
    
    // Lấy nút thanh toán
    const checkoutBtn = checkoutModal.querySelector('.checkout-btn');
    const originalBtnText = checkoutBtn.innerHTML;
    
    try {
        // Đánh dấu đang xử lý và vô hiệu hóa nút
        isProcessingMultiCheckout = true;
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
        
        let idHoaDon = null;
        const idNguoiDung = getCookie('user');
        
        if (!idNguoiDung) {
            toast({
                title: "Lỗi",
                message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
                type: "error",
                duration: 3000,
            });
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalBtnText;
            return;
        }

        try {
            // Get form data
            const radioBtn = document.getElementById('checkoutEditAddress');
            const newAddress = document.getElementById('checkoutAddressInput').value;
            const products = productList.querySelectorAll('.product-details');
            const currentDate = new Date().toISOString().slice(0, 10);
            
            if (products.length === 0) {
                throw new Error("Giỏ hàng trống!");
            }

            // Lấy ID tài khoản
            let idTaiKhoan;
            try {
                idTaiKhoan = await getIdTaiKhoan(idNguoiDung);
            } catch (error) {
                throw new Error("Không thể lấy thông tin tài khoản: " + error.message);
            }

            // Calculate total price and collect product data
            let totalPrice = 0;
            const productData = [];
            for (const product of products) {
                const price = parseFormattedPrice(product.dataset.price);
                const quantity = parseInt(product.querySelector('.quantity-value').textContent);
                const idCHSP = product.dataset.idchsp;
                const idDSP = product.dataset.iddsp;
                totalPrice += price * quantity;
                productData.push({ price, quantity, idCHSP, idDSP });
            }

            // Kiểm tra tồn kho trước khi tạo hóa đơn
            for (let i = 0; i < productData.length; i++) {
                const { quantity, idCHSP, idDSP } = productData[i];
                const productName = products[i].querySelector('h6').textContent;
                
                try {
                    const stockResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}&idCHSP=${idCHSP}`);
                    if (!stockResponse.ok) {
                        throw new Error(`Không thể kiểm tra tồn kho cho sản phẩm "${productName}"`);
                    }
                    
                    const stockData = await stockResponse.json();
                    const availableStock = stockData.SoLuong || 0;
                    
                    if (availableStock < quantity) {
                        throw new Error(`Sản phẩm "${productName}" chỉ còn ${availableStock} trong kho, không đủ ${quantity} sản phẩm bạn yêu cầu.`);
                    }
                } catch (error) {
                    if (error.message.includes("chỉ còn")) {
                        throw error;
                    }
                    console.warn(`Không thể kiểm tra tồn kho cho sản phẩm ${productName}:`, error);
                    // Tiếp tục mà không dừng lại, sẽ kiểm tra lại khi lấy IMEI
                }
            }

            // Create invoice (HoaDon) with all products
            const hoaDonData = {
                IdTaiKhoan: idTaiKhoan,
                NgayTao: currentDate,
                ThanhTien: totalPrice,
                TrangThai: 1,
                IdTinhTrang: 1,
                products: productData.map(p => ({
                    IdCHSP: p.idCHSP,
                    IdDongSanPham: p.idDSP,
                    SoLuong: p.quantity
                }))
            };
            
            // Tạo hóa đơn
            let hoaDonResponse;
            try {
                hoaDonResponse = await fetch('/smartstation/src/mvc/controllers/HoaDonController.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(hoaDonData)
                });
                
                if (!hoaDonResponse.ok) {
                    const responseText = await hoaDonResponse.text();
                    console.error("Lỗi từ server khi tạo hóa đơn:", responseText);
                    
                    // Kiểm tra nếu response là HTML thay vì JSON
                    if (responseText.includes("<br") || responseText.includes("<html")) {
                        throw new Error("Lỗi server khi tạo hóa đơn. Vui lòng thử lại sau.");
                    }
                    
                    // Thử parse JSON
                    try {
                        const errorData = JSON.parse(responseText);
                        throw new Error("Thêm hóa đơn thất bại: " + (errorData.message || ""));
                    } catch (jsonError) {
                        throw new Error("Thêm hóa đơn thất bại: " + responseText);
                    }
                }
                
                const hoaDonDataResult = await hoaDonResponse.json();
                if (!hoaDonDataResult.HoaDon) {
                    throw new Error("Thêm hóa đơn thất bại: " + (hoaDonDataResult.message || ""));
                }

                idHoaDon = hoaDonDataResult.HoaDon.IdHoaDon;
            } catch (error) {
                throw new Error("Lỗi khi tạo hóa đơn: " + error.message);
            }

            // Update address if edited
            if (radioBtn.checked && newAddress) {
                try {
                    const response = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ DiaChi: newAddress })
                    });
                    
                    if (!response.ok) {
                        console.warn("Cập nhật địa chỉ thất bại:", await response.text());
                        // Tiếp tục mà không dừng lại
                    }
                } catch (error) {
                    console.warn("Lỗi khi cập nhật địa chỉ:", error);
                    // Tiếp tục mà không dừng lại
                }
            }

            // Process each product for CTHoaDon
            for (let i = 0; i < productData.length; i++) {
                const { price, quantity, idCHSP, idDSP } = productData[i];
                const productName = products[i].querySelector('h6').textContent;
                
                try {
                    // Lấy danh sách IMEI
                    let imeiResponse;
                    try {
                        imeiResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?idCHSP=${idCHSP}&idDongSanPham=${idDSP}&quantity=${quantity}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        
                        if (!imeiResponse.ok) {
                            const errorText = await imeiResponse.text();
                            console.error(`Lỗi khi lấy IMEI (${imeiResponse.status}):`, errorText);
                            
                            // Kiểm tra nếu response là HTML thay vì JSON
                            if (errorText.includes("<br") || errorText.includes("<html")) {
                                throw new Error(`Lỗi server khi lấy IMEI cho sản phẩm "${productName}". Vui lòng thử lại sau.`);
                            }
                            
                            // Thử parse JSON từ lỗi
                            try {
                                const errorJson = JSON.parse(errorText);
                                throw new Error(errorJson.message || `Lỗi khi lấy IMEI: ${imeiResponse.status}`);
                            } catch (jsonError) {
                                throw new Error(`Lỗi khi lấy IMEI cho sản phẩm "${productName}": ${errorText}`);
                            }
                        }
                    } catch (error) {
                        throw new Error(`Lỗi khi lấy IMEI cho sản phẩm "${productName}": ${error.message}`);
                    }
                    
                    let imeiData;
                    try {
                        imeiData = await imeiResponse.json();
                    } catch (error) {
                        console.error("Lỗi khi parse JSON từ response IMEI:", error);
                        throw new Error(`Lỗi khi xử lý dữ liệu IMEI cho sản phẩm "${productName}"`);
                    }
                    
                    if (!imeiData.Imeis) {
                        throw new Error(`Không nhận được danh sách IMEI cho sản phẩm "${productName}"`);
                    }
                    
                    if (imeiData.Imeis.length < quantity) {
                        throw new Error(`Sản phẩm "${productName}" chỉ còn ${imeiData.Imeis.length} trong kho, không đủ ${quantity} sản phẩm bạn yêu cầu.`);
                    }
                    
                    // Thêm chi tiết hóa đơn cho từng IMEI
                    for (let j = 0; j < quantity; j++) {
                        const imei = imeiData.Imeis[j];
                        const ctHoaDonData = {
                            IdHoaDon: idHoaDon,
                            GiaTien: price,
                            SoLuong: 1,
                            Imei: imei
                        };

                        try {
                            const ctHoaDonResponse = await fetch('/smartstation/src/mvc/controllers/CTHoaDonController.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(ctHoaDonData)
                            });
                            
                            if (!ctHoaDonResponse.ok) {s
                                const errorText = await ctHoaDonResponse.text();
                                console.error(`Lỗi khi thêm chi tiết hóa đơn (${ctHoaDonResponse.status}):`, errorText);
                                
                                // Kiểm tra nếu response là HTML thay vì JSON
                                if (errorText.includes("<br") || errorText.includes("<html")) {
                                    throw new Error(`Lỗi server khi thêm chi tiết hóa đơn cho sản phẩm "${productName}". Vui lòng thử lại sau.`);
                                }
                                
                                throw new Error(`Thêm chi tiết hóa đơn cho sản phẩm "${productName}", IMEI ${imei} thất bại`);
                            }
                            
                            const ctHoaDonResult = await ctHoaDonResponse.json();
                            if (!ctHoaDonResult.message || !ctHoaDonResult.message.includes("thành công")) {
                                throw new Error(`Thêm chi tiết hóa đơn cho sản phẩm "${productName}", IMEI ${imei} thất bại: ${ctHoaDonResult.message || ""}`);
                            }
                        } catch (error) {
                            throw new Error(`Lỗi khi thêm chi tiết hóa đơn cho sản phẩm "${productName}", IMEI ${imei}: ${error.message}`);
                        }
                    }
                } catch (error) {
                    // Nếu có lỗi, thử xóa hóa đơn đã tạo
                    if (idHoaDon) {
                        try {
                            await fetch(`/smartstation/src/mvc/controllers/HoaDonController.php?idHoaDon=${idHoaDon}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            console.log(`Đã xóa hóa đơn ${idHoaDon} sau khi xảy ra lỗi`);
                        } catch (deleteError) {
                            console.error("Không thể xóa hóa đơn sau khi xảy ra lỗi:", deleteError);
                        }
                    }
                    
                    throw error; // Ném lại lỗi để xử lý ở catch bên ngoài
                }
            }

            // Clear cart after successful checkout
            localStorage.removeItem('cart');
            updateCartBadge(); // Gọi hàm cập nhật cart badge
            toast({
                title: "Thành công",
                message: "Thanh toán thành công! Cảm ơn bạn đã mua hàng.",
                type: "success",
                duration: 3000,
            });
            const myModal = bootstrap.Modal.getInstance(checkoutModal);
            myModal.hide();
            productList.innerHTML = ''; // Clear product list
            updateTotalPrice();

            // Cập nhật số lượng sản phẩm trong giỏ hàng trên giao diện
            const cartCountElement = document.getElementById('cart-badge');
            if (cartCountElement) {
                cartCountElement.textContent = '0';
            }
        } catch (error) {
            console.error("Chi tiết lỗi thanh toán:", error);
            console.error("Stack trace:", error.stack);
            
            // Hiển thị thông báo lỗi thân thiện hơn
            toast({
                title: "Lỗi thanh toán",
                message: error.message || "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.",
                type: "error",
                duration: 5000,
            });
        } finally {
            // Đặt lại trạng thái khi hoàn thành
            isProcessingMultiCheckout = false;
            
            // Khôi phục trạng thái nút thanh toán
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalBtnText;
        }
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        toast({
            title: "Lỗi thanh toán",
            message: error.message || "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.",
            type: "error",
            duration: 5000,
        });
    } finally {
        // Luôn đặt lại trạng thái và nút khi hoàn thành hoặc có lỗi
        isProcessingMultiCheckout = false;
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = originalBtnText;
    }
}

/**
 * Close modal
 * @param {string} modalId - Modal ID
 */
function handleCloseModal(modalId) {
    const myModal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    myModal.hide();
    isQuantitySelectorsSetup = false; // Reset state
}

/**
 * Load products from cart to checkout modal
 */
function loadListProduct() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    productList.innerHTML = '';
    
    if (cart.length === 0) {
        productList.innerHTML = '<p>Không có sản phẩm nào trong giỏ hàng.</p>';
        return;
    }
    
    let html = '';
    cart.forEach((product, index) => {
        // Xử lý hiển thị giá
        let priceDisplay = '';
        let actualPrice = 0;
        
        if (product.discountPrice && product.discountPrice.trim() !== '') {
            // Có giá khuyến mãi
            priceDisplay = `<span class="text-decoration-line-through text-muted me-2">${product.price}</span><span class="text-success">${product.discountPrice}</span>`;
            actualPrice = parseFormattedPrice(product.discountPrice);
        } else {
            // Không có giá khuyến mãi
            priceDisplay = `<p class="text-success mb-0">${formatPrice(parseFormattedPrice(product.price))}</p>`;
            actualPrice = parseFormattedPrice(product.price);
        }
        
        // Tạo chuỗi JSON cho cấu hình sản phẩm
        const config = {
            "RAM": product.ram || "N/A",
            "Bộ nhớ trong": product.rom || "N/A",
            "Màn hình": product.screenSize || "N/A",
            "Dung lượng pin": product.pin || "N/A",
            "Màu sắc": product.color || "N/A",
            "Camera": product.camera || "N/A"
        };
        
        html += `
        <div class="product-details" data-idchsp="${product.idCHSP}" data-iddsp="${product.idDSP}" data-price="${actualPrice}" data-config='${JSON.stringify(config)}'>
            <img src="${product.img}" alt="${product.name}" class="product-image" style="width: 80px;">
            <div class="flex-grow-1">
                <h6>${product.name} - ${product.ram} - Màu ${product.color}</h6>
                ${priceDisplay}
            </div>
            <div class="quantity-selector">
                <button class="btn-decrement">-</button>
                <span class="quantity-value">${product.quantity || 1}</span>
                <button class="btn-increment">+</button>
            </div>
            <button class="details-btn">Xem chi tiết</button>
            <button class="delete-btn">Xóa</button>
        </div>`;
    });
    
    productList.innerHTML = html;
    updateTotalPrice();
}

/**
 * Handle click checkout button
 */
function handleClickCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }

    // Kiểm tra dữ liệu trong giỏ hàng
    console.log("Dữ liệu giỏ hàng:", cart);
    cart.forEach((item, index) => {
        console.log(`Sản phẩm ${index + 1}:`, item);
        console.log(`- idCHSP: ${item.idCHSP}`);
        console.log(`- idDSP: ${item.idDSP}`);
    });

    if(!getCookieValue("username")) {
        toast({
            title: "Cảnh báo",
            message: "Đăng nhập trước khi mua hàng!",
            type: "warning",
            duration: 3000,
        });
        return;
    }

    const myModal = new bootstrap.Modal(checkoutModal);
    myModal.show();
    loadListProduct();
    setUserInfo();
    setupQuantitySelectors();
    setupProductDetails();
    setupProductDeletion();
    handleAddressInput('checkoutModal');
    document.getElementById('checkoutEditAddress').checked = false;
    document.getElementById('checkoutAddressInput').disabled = true;
}

// Khởi tạo sự kiện cho nút thanh toán
document.addEventListener('DOMContentLoaded', function() {
    // Nút thanh toán trong modal
    const checkoutBtn = checkoutModal.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleMultiProductCheckout);
    }
    
    // Nút đóng modal
    const closeBtn = checkoutModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => handleCloseModal('checkoutModal'));
    }
    
    // Reset state khi modal đóng
    checkoutModal.addEventListener('hidden.bs.modal', () => {
        isQuantitySelectorsSetup = false;
    });
});

// Export functions for external use

/**
 * Update cart badge count
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;
    cart.forEach(product => {
        totalQuantity += product.quantity || 1;
    });
    
    // Cập nhật tất cả các phần tử hiển thị số lượng giỏ hàng
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = totalQuantity;
    });
}

updateCartBadge(); // Gọi hàm cập nhật cart badge

