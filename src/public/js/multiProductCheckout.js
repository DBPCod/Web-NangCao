const checkoutModal = document.getElementById('checkoutModal');
console.log(checkoutModal);
const productList = checkoutModal.querySelector('#product-list');
// const idNguoiDung = getCookieValue('user');
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
function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    return match ? match[2] : null;
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
function updateProductQuantityButtons(product, value) {
    const btnDecrement = product.querySelector('.btn-decrement');
    const btnIncrement = product.querySelector('.btn-increment');
    btnDecrement.disabled = value <= 1;
    btnIncrement.disabled = value >= 10;
}

// Setup quantity selectors for all products
function setupQuantitySelectors() {
    if (isQuantitySelectorsSetup) return;

    const products = productList.querySelectorAll('.product-details');
    products.forEach(product => {
        const btnDecrement = product.querySelector('.btn-decrement');
        const btnIncrement = product.querySelector('.btn-increment');
        const quantityElement = product.querySelector('.quantity-value');

        updateProductQuantityButtons(product, parseInt(quantityElement.textContent));

        btnIncrement.addEventListener('click', () => {
            let value = parseInt(quantityElement.textContent);
            if (value < 10) {
                quantityElement.textContent = value + 1;
                updateProductQuantityButtons(product, value + 1);
                updateTotalPrice();
            }
        });

        btnDecrement.addEventListener('click', () => {
            let value = parseInt(quantityElement.textContent);
            if (value > 1) {
                quantityElement.textContent = value - 1;
                updateProductQuantityButtons(product, value - 1);
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
            configContainer.innerHTML = html;
        });
    });
}

// Setup product deletion
function setupProductDeletion() {
    const products = productList.querySelectorAll('.product-details');
    products.forEach(product => {
        const deleteBtn = product.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            product.remove();
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
        let totalQuantity = 0;
        const productData = [];
        for (const product of products) {
            const price = parseFormattedPrice(product.dataset.price);
            const quantity = parseInt(product.querySelector('.quantity-value').textContent);
            const idCHSP = product.dataset.idCHSP;
            const idDSP = product.dataset.idDSP;
            totalPrice += price * quantity;
            totalQuantity += quantity;
            productData.push({ price, quantity, idCHSP, idDSP });
        }

        // Create invoice (HoaDon)
        const hoaDonData = {
            IdTaiKhoan: idTaiKhoan,
            NgayTao: currentDate,
            ThanhTien: totalPrice,
            TrangThai: 1,
            IdTinhTrang: 1,
            SoLuong: totalQuantity,
            IdCHSP: productData[0].idCHSP, // For compatibility with single product
            IdDongSanPham: productData[0].idDSP // For compatibility with single product
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

        // Process each product
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

function loadDataCheckoutManyProducts()
{
    var checkoutModalBody = document.getElementById('checkoutModalBody');
    console.log(checkoutModalBody);
}
function handleClickCheckout()
{
        const myModal = new bootstrap.Modal(checkoutModal);
        myModal.show();
        loadDataCheckoutManyProducts();
        setUserInfo();
        setupQuantitySelectors();
        setupProductDetails();
        setupProductDeletion();
        handleAddressInput('checkoutModal');
        document.getElementById('checkoutEditAddress').checked = false;
        document.getElementById('checkoutAddressInput').disabled = true;
}

// Initialize modal when shown


// Reset state when modal closes
checkoutModal.addEventListener('hidden.bs.modal', () => {
    isQuantitySelectorsSetup = false;
});
