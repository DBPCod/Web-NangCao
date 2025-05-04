const checkoutModal = document.getElementById('checkoutModal');
const productList = checkoutModal.querySelector('#product-list');
// const idNguoiDung = getCookie('user');
let isQuantitySelectorsSetup = false;

// Format price with commas (e.g., 30190000 -> 30,190,000 đ)
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}

// Parse formatted price (e.g., "30,190,000 đ" -> 30190000)
function parseFormattedPrice(formattedPrice) {
    try {
        if (!formattedPrice) throw new Error("Giá không được cung cấp");
        const cleanedPrice = formattedPrice.replace(/\./g, '').replace(/\s?VNĐ|đ/i, '').trim();
        const price = parseInt(cleanedPrice);
        if (isNaN(price)) throw new Error("Giá không hợp lệ");
        return price;
    } catch (error) {
        console.error("Lỗi khi phân tích giá:", error);
        return 0;
    }
}

// Get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Update total price of all products
function updateTotalPrice() {
    let total = 0;
    const products = productList.querySelectorAll('.product-details');
    products.forEach(product => {
        const price = parseFormattedPrice(product.dataset.price);
        const quantity = parseInt(product.querySelector('.quantity-value').textContent);
        total += price * quantity;
    });
    const totalPriceElement = checkoutModal.querySelector('#total-price-products');
    totalPriceElement.innerText = `Tổng tiền: ${formatPrice(total)}`;
}

// Update quantity buttons state for a product
function updateProductQuantityButtons(product, value, maxStock) {
    const btnDecrement = product.querySelector('.btn-decrement');
    const btnIncrement = product.querySelector('.btn-increment');
    btnDecrement.disabled = value <= 1;
    btnIncrement.disabled = value >= maxStock;
}

// Setup quantity selectors for all products
async function setupQuantitySelectors() {
    if (isQuantitySelectorsSetup) return;

    const products = productList.querySelectorAll('.product-details');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Lấy thông tin tồn kho cho tất cả sản phẩm
    const stockPromises = [];
    for (const product of products) {
        const idCHSP = product.dataset.idchsp;
        const idDSP = product.dataset.iddsp;
        stockPromises.push(
            fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}&idCHSP=${idCHSP}`)
                .then(response => response.json())
                .then(data => ({
                    idCHSP,
                    idDSP,
                    stock: data.SoLuong || 0
                }))
                .catch(error => ({
                    idCHSP,
                    idDSP,
                    stock: 0,
                    error
                }))
        );
    }

    const stockResults = await Promise.all(stockPromises);
    const stockMap = {};
    stockResults.forEach(result => {
        stockMap[`${result.idCHSP}-${result.idDSP}`] = result.stock;
    });

    products.forEach(product => {
        const btnDecrement = product.querySelector('.btn-decrement');
        const btnIncrement = product.querySelector('.btn-increment');
        const quantityElement = product.querySelector('.quantity-value');
        const idCHSP = product.dataset.idchsp;
        const idDSP = product.dataset.iddsp;
        const stockKey = `${idCHSP}-${idDSP}`;
        const maxStock = stockMap[stockKey] || 0;

        // Cập nhật số lượng ban đầu nếu vượt quá tồn kho
        let currentQuantity = parseInt(quantityElement.textContent);
        if (currentQuantity > maxStock) {
            quantityElement.textContent = maxStock;
            currentQuantity = maxStock;
            
            // Cập nhật giỏ hàng
            const cartItem = cart.find(item => item.idCHSP === idCHSP);
            if (cartItem) {
                cartItem.quantity = maxStock;
                localStorage.setItem('cart', JSON.stringify(cart));
            }
            
            // Hiển thị thông báo
            toast({
                title: "Cảnh báo",
                message: `Số lượng sản phẩm đã được điều chỉnh theo tồn kho (${maxStock})`,
                type: "warning",
                duration: 3000,
            });
        }

        // Cập nhật trạng thái nút
        updateProductQuantityButtons(product, currentQuantity, maxStock);

        btnIncrement.addEventListener('click', () => {
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
            } else {
                toast({
                    title: "Cảnh báo",
                    message: `Số lượng tồn kho chỉ còn ${maxStock} sản phẩm!`,
                    type: "warning",
                    duration: 3000,
                });
            }
        });

        btnDecrement.addEventListener('click', () => {
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
    });

    isQuantitySelectorsSetup = true;
    updateTotalPrice();
}

// Setup product details display
function setupProductDetails() {
    const products = productList.querySelectorAll('.product-details');
    products.forEach(product => {
        const detailsBtn = product.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            const config = JSON.parse(product.dataset.config);
            const configContainer = checkoutModal.querySelector('#config-container');
            let html = '<h6>Chi tiết cấu hình:</h6>';
            for (const [key, value] of Object.entries(config)) {
                html += `
                    <div class="config-item">
                        <span class="config-label">${key}</span>
                        <span class="config-value">${value}</span>
                    </div>`;
            }
            configContainer.innerHTML = html; // Gán vào config-container thay vì productList
        });
    });
}

// Setup product deletion
function setupProductDeletion() {
    const products = productList.querySelectorAll('.product-details');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    products.forEach(product => {
        const deleteBtn = product.querySelector('.delete-btn');
        const idCHSP = product.dataset.idCHSP;

        deleteBtn.addEventListener('click', () => {
            product.remove();
            // Remove from localStorage
            cart = cart.filter(item => item.idCHSP !== idCHSP);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateTotalPrice();
            if (productList.children.length === 0) {
                checkoutModal.querySelector('#config-container').innerHTML = '<p>Không còn sản phẩm trong giỏ hàng.</p>';
            }
        });
    });
}

// Handle address input editability
function handleAddressInput(modalId) {
    const addressInput = document.getElementById(modalId === 'buyNowModal' ? 'address-input' : 'checkoutAddressInput');
    const editAddressRadio = document.getElementById(modalId === 'buyNowModal' ? 'edit-address' : 'checkoutEditAddress');

    const newRadio = editAddressRadio.cloneNode(true);
    editAddressRadio.parentNode.replaceChild(newRadio, editAddressRadio);

    newRadio.addEventListener('change', () => {
        addressInput.disabled = !newRadio.checked;
    });
}

// Set user information in modal
async function setUserInfo() {
    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`);
        const userData = await response.json();
        document.getElementById('checkoutTel').value = userData.SoDienThoai || '';
        document.getElementById('checkoutFullName').value = userData.HoVaTen || '';
        document.getElementById('checkoutEmail').value = userData.Email || '';
        document.getElementById('checkoutAddressInput').value = userData.DiaChi || '';
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert("Lỗi: " + error.message);
    }
}

// Get account ID from TaiKhoanController
async function getIdTaiKhoan(idNguoiDung) {
    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/TaiKhoanController.php?idNguoiDung=${idNguoiDung}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data && data.IdTaiKhoan) {
            return data.IdTaiKhoan;
        }
        throw new Error("Không tìm thấy IdTaiKhoan cho IdNguoiDung: " + idNguoiDung);
    } catch (error) {
        throw error;
    }
}

// Handle multi-product checkout
async function handleMultiProductCheckout() {
    try {
        // Get form data
        const radioBtn = document.getElementById('checkoutEditAddress');
        const newAddress = document.getElementById('checkoutAddressInput').value;
        const products = productList.querySelectorAll('.product-details');
        const currentDate = new Date().toISOString().slice(0, 10);
        const idTaiKhoan = await getIdTaiKhoan(idNguoiDung);
        if (products.length === 0) {
            throw new Error("Giỏ hàng trống!");
        }

        // Calculate total price and collect product data
        let totalPrice = 0;
        const productData = [];
        for (const product of products) {
            const price = parseFormattedPrice(product.dataset.price);
            const quantity = parseInt(product.querySelector('.quantity-value').textContent);
            const idCHSP = product.dataset.idchsp; // Fixed: Use camelCase to match dataset
            const idDSP = product.dataset.iddsp;   // Fixed: Use camelCase to match dataset
            totalPrice += price * quantity;
            productData.push({ price, quantity, idCHSP, idDSP });
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
        const hoaDonResponse = await fetch('/smartstation/src/mvc/controllers/HoaDonController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hoaDonData)
        });
        const hoaDonDataResult = await hoaDonResponse.json();
        if (!hoaDonDataResult.HoaDon) {
            throw new Error("Thêm hóa đơn thất bại");
        }

        const idHoaDon = hoaDonDataResult.HoaDon.IdHoaDon;

        // Update address if edited
        if (radioBtn.checked && newAddress) {
            const response = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ DiaChi: newAddress })
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error("Cập nhật địa chỉ thất bại");
            }
        }

        // Process each product for CTHoaDon
        for (let i = 0; i < productData.length; i++) {
            const { price, quantity, idCHSP, idDSP } = productData[i];

            // Fetch multiple IMEIs for this product
            const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?idCHSP=${idCHSP}&idDongSanPham=${idDSP}&quantity=${quantity}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Lỗi mạng khi lấy danh sách IMEI cho sản phẩm thứ ${i + 1}`);
            }
            const data = await response.json();
            if (!data.Imeis || data.Imeis.length < quantity) {
                throw new Error(data.message || `Không đủ sản phẩm trong kho cho sản phẩm thứ ${i + 1}. Yêu cầu: ${quantity}, Còn lại: ${data.Imeis ? data.Imeis.length : 0}`);
            }

            // Create CTHoaDon for each IMEI
            for (let j = 0; j < data.Imeis.length; j++) {
                const imei = data.Imeis[j];
                const ctHoaDonData = {
                    IdHoaDon: idHoaDon,
                    GiaTien: price,
                    SoLuong: 1,
                    Imei: imei
                };

                
                const ctHoaDonResponse = await fetch('/smartstation/src/mvc/controllers/CTHoaDonController.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ctHoaDonData)
                });
                const ctHoaDonResult = await ctHoaDonResponse.json();
                if (!ctHoaDonResult.message.includes("thành công")) {
                    throw new Error(`Thêm chi tiết hóa đơn cho sản phẩm thứ ${i + 1}, IMEI thứ ${j + 1} thất bại`);
                }
            }
        }

        // Clear cart after successful checkout
        localStorage.removeItem('cart');
        alert("Thanh toán thành công!");
        const myModal = bootstrap.Modal.getInstance(checkoutModal);
        myModal.hide();
        productList.innerHTML = ''; // Clear product list
        updateTotalPrice();
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        alert("Lỗi thanh toán: " + error.message);
    }
}

// Close modal
function handleCloseModal(modalId) {
    const myModal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    myModal.hide();
    isQuantitySelectorsSetup = false; // Reset state
}

// Load product list from localStorage
function loadListProduct() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let html = '';
    cart.forEach((product) => {
        html += `
            <div class="product-details" data-config='{
                "RAM": "${product.ram || 'N/A'}",
                "Bộ nhớ trong": "${product.rom || 'N/A'}",
                "Màn hình": "${product.screenSize || 'N/A'}",
                "Dung lượng pin": "${product.pin || 'N/A'}",
                "Màu sắc": "${product.color || 'N/A'}",
                "Camera": "${product.camera || 'N/A'}"
            }' data-price="${parseFormattedPrice(product.price)}" data-idCHSP="${product.idCHSP}" data-idDSP="${product.idDSP}">
                <img src="${product.img}" alt="${product.name}" class="product-image" style="width: 80px;">
                <div class="flex-grow-1">
                    <h6>${product.name}</h6>
                    <p class="text-success mb-0">${product.price}</p>
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

// Handle click checkout button
function handleClickCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }


    if(!getCookieValue("username"))
        {
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
