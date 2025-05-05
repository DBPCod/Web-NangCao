const buyNowModal = document.getElementById('buyNowModal');
const buyNowQuantityElement = buyNowModal.querySelector('.quantity-value');
const buyNowBtnDecrement = buyNowModal.querySelector('.btn-decrement');
const buyNowBtnIncrement = buyNowModal.querySelector('.btn-increment');
let buyNowPriceElement = buyNowModal.querySelector('.text-success');
const idNguoiDung = getCookieValue('user');
let isBuyNowQuantitySelectorsSetup = false;
let price; // Biến toàn cục để lưu giá sản phẩm đơn vị

// Thêm biến để theo dõi trạng thái thanh toán
let isProcessingPayment = false;

// Format price with commas (e.g., 30190000 -> 30,190,000 đ)
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}

// Parse formatted price (e.g., "30,190,000 đ" -> 30190000)
function parseFormattedPrice(formattedPrice) {
    try {
        if (!formattedPrice) throw new Error("Giá không được cung cấp");
        const cleanedPrice = formattedPrice.replace(/[,]/g, '').replace(/\s?VNĐ|đ/i, '').trim();
        const price = parseInt(cleanedPrice);
        if (isNaN(price)) throw new Error("Giá không hợp lệ");
        return price;
    } catch (error) {
        console.error("Lỗi khi phân tích giá:", error);
        return 0;
    }
}

// Update quantity buttons state (enable/disable increment/decrement buttons)
function updateQuantityButtons(value) {
    buyNowBtnDecrement.disabled = value <= 1;
    buyNowBtnIncrement.disabled = value >= 10;
}

// Update total price in modal based on unit price and quantity
function updateModalTotalPrice(price, quantity) {
    const total = price * quantity;
    const modalTotalPrice = buyNowModal.querySelector('.modal-body #total-price');
    if (modalTotalPrice) {
        modalTotalPrice.innerText = `Tổng tiền: ${formatPrice(total)}`;
    }
}

// Increment quantity and update UI
function incrementQuantity() {
    let value = parseInt(buyNowQuantityElement.textContent);
    if (value < 10) {
        buyNowQuantityElement.textContent = value + 1;
        updateQuantityButtons(value + 1);
        updateModalTotalPrice(price, value + 1);
    }
}

// Decrement quantity and update UI
function decrementQuantity() {
    let value = parseInt(buyNowQuantityElement.textContent);
    if (value > 1) {
        buyNowQuantityElement.textContent = value - 1;
        updateQuantityButtons(value - 1);
        updateModalTotalPrice(price, value - 1);
    }
}

// Setup modal quantity selectors (initialize buttons and event listeners)
function setupModalQuantitySelectors() {
    updateQuantityButtons(1);
    buyNowPriceElement = buyNowModal.querySelector('.text-success');
    if (!buyNowPriceElement || !buyNowPriceElement.dataset.price) {
        console.error("Không tìm thấy giá sản phẩm hoặc dataset.price");
        return;
    }

    price = parseFormattedPrice(buyNowPriceElement.dataset.price.replace("đ", "").trim());

    // Remove old event listeners if already setup
    if (isBuyNowQuantitySelectorsSetup) {
        buyNowBtnIncrement.removeEventListener('click', incrementQuantity);
        buyNowBtnDecrement.removeEventListener('click', decrementQuantity);
    }

    // Attach new event listeners
    buyNowBtnIncrement.addEventListener('click', incrementQuantity);
    buyNowBtnDecrement.addEventListener('click', decrementQuantity);

    isBuyNowQuantitySelectorsSetup = true;

    // Update total price immediately
    updateModalTotalPrice(price, parseInt(buyNowQuantityElement.textContent));
}

// Handle address input editability (enable/disable address input)
function handleAddressInput(modalId) {
    const addressInput = document.getElementById(modalId === 'buyNowModal' ? 'address-input' : 'checkoutAddressInput');
    const editAddressRadio = document.getElementById(modalId === 'buyNowModal' ? 'edit-address' : 'checkoutEditAddress');

    // Clone and replace radio to avoid duplicate event listeners
    const newRadio = editAddressRadio.cloneNode(true);
    editAddressRadio.parentNode.replaceChild(newRadio, editAddressRadio);

    newRadio.addEventListener('change', () => {
        addressInput.disabled = !newRadio.checked;
    });
}

// Get cookie value by name
function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    return match ? match[2] : null;
}

// Handle "Mua ngay" button click (validate and fetch product image)
function handleClickMuaNgay() {
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
    const elementDSP = document.querySelector('#modalProductRam .selected');
    const elementCHSP = document.querySelector('#modalProductMauSac .selected');

    if (elementDSP && elementCHSP) {
        const idDSP = elementDSP.getAttribute('iddsp');
        const idCHSP = elementCHSP.getAttribute('idchsp');
        const priceProduct = document.querySelector('#modalProductPrice').innerText;
        getAnh(idCHSP, idDSP, priceProduct);
    } else {
        alert('Vui lòng chọn phiên bản sản phẩm!');
    }
}

// Fetch product image from AnhController
function getAnh(idCHSP, idDSP, priceProduct) {
    fetch(`/smartstation/src/mvc/controllers/AnhController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Lỗi mạng khi tải ảnh');
        return response.json();
    })
    .then(data => {
        if (data.length !== 0) {
            const imageSrc = `data:image/jpeg;base64,${data[0].Anh}`;
            const product = {
                img: imageSrc,
                idDSP: idDSP,
                idCHSP: idCHSP,
                price: priceProduct
            };
            SetInfor(product);
        } else {
            throw new Error("Không tìm thấy ảnh sản phẩm");
        }
    })
    .catch(error => {
        console.error("Lỗi khi tải ảnh:", error);
        alert("Lỗi: " + error.message);
    });
}

// Close modal
function handleCloseModal() {
    const myModal = bootstrap.Modal.getInstance(buyNowModal);
    myModal.hide();
    isBuyNowQuantitySelectorsSetup = false; // Reset state
}

// Set product and user information in modal
async function SetInfor(product) {
    try {
        // Fetch user data
        const userResponse = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`);
        const userData = await userResponse.json();
        console.log(userData);
        document.getElementById('FullName').value = userData.HoVaTen || '';
        document.getElementById('PhoneNumber').value = userData.SoDienThoai || '';
        document.getElementById('Email').value = userData.Email || '';
        document.getElementById('address-input').value = userData.DiaChi || '';

        // Fetch product data
        const productResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${product.idDSP}&idCHSP=${product.idCHSP}`);
        const productData = await productResponse.json();

        // Render product information
        const html = `
            <img src="${product.img}" alt="" class="product-image">
            <h4 class="mt-3">${productData.TenDong}</h4>
            <h3 class="text-success" data-price="${product.price}">${product.price}</h3>
            <div class="config-container">
                <div class="config-item">
                    <span class="config-label">RAM</span>
                    <span class="config-value">${productData.Ram}</span>
                </div>
                <div class="config-item">
                    <span class="config-label">Bộ nhớ trong</span>
                    <span class="config-value">${productData.Rom}</span>
                </div>
                <div class="config-item">
                    <span class="config-label">Màn hình</span>
                    <span class="config-value">${productData.ManHinh}</span>
                </div>
                <div class="config-item">
                    <span class="config-label">Dung lượng pin</span>
                    <span class="config-value">${productData.Pin}</span>
                </div>
                <div class="config-item">
                    <span class="config-label">Màu sắc</span>
                    <span class="config-value">${productData.MauSac}</span>
                </div>
                <div class="config-item">
                    <span class="config-label">Camera</span>
                    <span class="config-value">${productData.Camera}</span>
                </div>
            </div>`;
        const productContainer = buyNowModal.querySelector(".col-md-6");
        productContainer.innerHTML = html;
        productContainer.dataset.idCHSP = product.idCHSP;
        productContainer.dataset.idDSP = product.idDSP;
        buyNowModal.querySelector('.modal-body .total-price').innerText = `Tổng tiền: ${product.price}`;
        buyNowQuantityElement.innerText = 1;

        // Show modal
        const myModal = new bootstrap.Modal(buyNowModal);
        myModal.show();

        // Initialize quantity selectors and address input
        setupModalQuantitySelectors();
        handleAddressInput('buyNowModal');
        document.getElementById('edit-address').checked = false;
        document.getElementById('address-input').disabled = true;
    } catch (error) {
        console.error("Lỗi khi thiết lập thông tin:", error);
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

// Handle checkout process
async function handleCheckout() {
    // Kiểm tra nếu đang xử lý thanh toán, không cho phép gọi lại
    if (isProcessingPayment) {
        return;
    }
    
    // Đánh dấu đang xử lý thanh toán
    isProcessingPayment = true;
    
    // Hiển thị loading spinner
    const checkoutBtn = document.querySelector('#buyNowModal .btn-secondary');
    
    if (!checkoutBtn) {
        console.error("Không tìm thấy nút thanh toán trong modal");
        isProcessingPayment = false;
        return;
    }
    
    const originalBtnText = checkoutBtn.innerHTML;
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
    
    try {
        // Get form data
        const radioBtn = document.getElementById('edit-address');
        const newAddress = document.getElementById('address-input').value;
        const quantity = parseInt(buyNowQuantityElement.textContent) || 1;
        const priceElement = buyNowModal.querySelector('.text-success');
        const unitPrice = parseFormattedPrice(priceElement.dataset.price.replace("đ", "").trim());
        const totalPrice = unitPrice * quantity;
        const idCHSP = buyNowModal.querySelector('.col-md-6').dataset.idCHSP;
        const idDongSanPham = buyNowModal.querySelector('.col-md-6').dataset.idDSP;
        const currentDate = new Date().toISOString().slice(0, 10);
        const idTaiKhoan = await getIdTaiKhoan(idNguoiDung);

        // Fetch multiple IMEIs in one request
        const imeiResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?idCHSP=${idCHSP}&idDongSanPham=${idDongSanPham}&quantity=${quantity}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!imeiResponse.ok) {
            throw new Error(`Lỗi mạng khi lấy danh sách IMEI cho sản phẩm (CHSP: ${idCHSP}, DSP: ${idDongSanPham})`);
        }
        const imeiData = await imeiResponse.json();
        if (!imeiData.Imeis || imeiData.Imeis.length < quantity) {
            throw new Error(imeiData.message || `Không đủ sản phẩm trong kho. Yêu cầu: ${quantity}, Còn lại: ${imeiData.Imeis ? imeiData.Imeis.length : 0}`);
        }

        // Create invoice (HoaDon)
        const hoaDonData = {
            IdTaiKhoan: idTaiKhoan,
            NgayTao: currentDate,
            ThanhTien: totalPrice,
            TrangThai: 1,
            IdTinhTrang: 1,
            SoLuong: quantity,
            IdCHSP: idCHSP,
            IdDongSanPham: idDongSanPham
        };
        const hoaDonResponse = await fetch('/smartstation/src/mvc/controllers/HoaDonController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hoaDonData)
        });
        const hoaDonDataResult = await hoaDonResponse.json();
        if (!hoaDonDataResult.HoaDon || !hoaDonDataResult.HoaDon.IdHoaDon) {
            throw new Error("Thêm hóa đơn thất bại. Vui lòng thử lại.");
        }

        const idHoaDon = hoaDonDataResult.HoaDon.IdHoaDon;

        // Update address if edited
        if (radioBtn.checked && newAddress) {
            const addressResponse = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ DiaChi: newAddress })
            });
            const addressData = await addressResponse.json();
            if (!addressData.success) {
                throw new Error("Cập nhật địa chỉ thất bại. Vui lòng kiểm tra lại thông tin địa chỉ.");
            }
        }

        // Create CTHoaDon for each IMEI
        for (let i = 0; i < imeiData.Imeis.length; i++) {
            const imei = imeiData.Imeis[i];
            const ctHoaDonData = {
                IdHoaDon: idHoaDon,
                GiaTien: unitPrice,
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
                throw new Error(`Thêm chi tiết hóa đơn cho sản phẩm thứ ${i + 1} thất bại. IMEI: ${imei}`);
            }
        }

        // Verify invoice status
        // const verifyResponse = await fetch(`/smartstation/src/mvc/controllers/HoaDonController.php?idHoaDon=${idHoaDon}`, {
        //     method: 'GET',
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // const verifyData = await verifyResponse.json();
        // if (!verifyData.HoaDon || verifyData.HoaDon.IdTinhTrang !== 1 || verifyData.HoaDon.TrangThai !== 1) {
        //     throw new Error("Hóa đơn không ở trạng thái hợp lệ sau khi tạo. Vui lòng liên hệ hỗ trợ.");
        // }

        toast({
            title: "Thành công",
            message: "Thanh toán thành công! Cảm ơn bạn đã mua hàng.",
            type: "success",
            duration: 3000,
        });
        const myModal = bootstrap.Modal.getInstance(buyNowModal);
        myModal.hide();
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        toast({
            title: "Lỗi thanh toán",
            message: error.message || "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.",
            type: "error",
            duration: 5000,
        });
    } finally {
        // Khôi phục trạng thái nút và biến theo dõi
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalBtnText;
        }
        isProcessingPayment = false;
    }
}

// Initialize address input handling
handleAddressInput('buyNowModal');

// Reset state when modal closes
buyNowModal.addEventListener('hidden.bs.modal', () => {
    isBuyNowQuantitySelectorsSetup = false;
    isProcessingPayment = false; // Reset trạng thái xử lý thanh toán
});

// --- New Additions Below (No Changes to Above Code) ---

// Global variable for stock
let availableStock = 0;

// Fetch stock for a product
async function fetchStock(idCHSP, idDSP) {
    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}&idCHSP=${idCHSP}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Lỗi mạng khi lấy số lượng tồn kho');
        const data = await response.json();
        return data.SoLuong || 0;
    } catch (error) {
        console.error("Lỗi khi lấy số lượng tồn kho:", error);
        toast({
            title: "Lỗi",
            message: "Không thể lấy số lượng tồn kho",
            type: "error",
            duration: 3000,
        });
        return 0;
    }
}

// New function to update quantity buttons with stock limit
function updateQuantityButtonsWithStock(value) {
    buyNowBtnDecrement.disabled = value <= 1;
    buyNowBtnIncrement.disabled = value >= availableStock;
}

// New function to increment quantity with stock limit
function incrementQuantityWithStock() {
    let value = parseInt(buyNowQuantityElement.textContent);
    if (value < availableStock) {
        buyNowQuantityElement.textContent = value + 1;
        updateQuantityButtonsWithStock(value + 1);
        updateModalTotalPrice(price, value + 1);
    } else {
        toast({
            title: "Cảnh báo",
            message: `Số lượng tồn kho chỉ còn ${availableStock} sản phẩm!`,
            type: "warning",
            duration: 3000,
        });
    }
}

// New function to setup quantity selectors with stock
async function setupModalQuantitySelectorsWithStock() {
    const idCHSP = buyNowModal.querySelector('.col-md-6').dataset.idCHSP;
    const idDSP = buyNowModal.querySelector('.col-md-6').dataset.idDSP;

    // Fetch stock
    availableStock = await fetchStock(idCHSP, idDSP);

    // Run original setup
    setupModalQuantitySelectors();

    // Override event listeners
    if (isBuyNowQuantitySelectorsSetup) {
        buyNowBtnIncrement.removeEventListener('click', incrementQuantity);
        buyNowBtnDecrement.removeEventListener('click', decrementQuantity);
    }

    buyNowBtnIncrement.addEventListener('click', incrementQuantityWithStock);
    buyNowBtnDecrement.addEventListener('click', decrementQuantity);
    updateQuantityButtonsWithStock(parseInt(buyNowQuantityElement.textContent));
}

// Wrap handleClickMuaNgay to check stock
const originalHandleClickMuaNgay = handleClickMuaNgay;
handleClickMuaNgay = async function() {
    const elementDSP = document.querySelector('#modalProductRam .selected');
    const elementCHSP = document.querySelector('#modalProductMauSac .selected');

    if (elementDSP && elementCHSP) {
        const idDSP = elementDSP.getAttribute('iddsp');
        const idCHSP = elementCHSP.getAttribute('idchsp');

        // Check stock
        const stock = await fetchStock(idCHSP, idDSP);
        if (stock === 0) {
            toast({
                title: "Cảnh báo",
                message: "Sản phẩm đã hết hàng! Vui lòng chọn sản phẩm khác.",
                type: "warning",
                duration: 3000,
            });
            return;
        }
    }

    // Call original function
    originalHandleClickMuaNgay();
};

// Override SetInfor to use new quantity selector setup
const originalSetInfor = SetInfor;
SetInfor = async function(product) {
    await originalSetInfor(product);
    await setupModalQuantitySelectorsWithStock();
};

// Sample addToCart function with stock validation
async function addToCart(product) {
    const stock = await fetchStock(product.idCHSP, product.idDSP);
    if (stock === 0) {
        toast({
            title: "Cảnh báo",
            message: "Sản phẩm đã hết hàng! Vui lòng chọn sản phẩm khác.",
            type: "warning",
            duration: 3000,
        });
        return false;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.idCHSP === product.idCHSP && item.idDSP === product.idDSP);
    if (existingItem) {
        if (existingItem.quantity >= stock) {
            toast({
                title: "Cảnh báo",
                message: `Số lượng tồn kho chỉ còn ${stock} sản phẩm!`,
                type: "warning",
                duration: 3000,
            });
            return false;
        }
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast({
        title: "Thành công",
        message: "Đã thêm sản phẩm vào giỏ hàng!",
        type: "success",
        duration: 3000,
    });
    return true;
}

// Khởi tạo sự kiện cho nút thanh toán
document.addEventListener('DOMContentLoaded', function() {
    // Nút thanh toán trong modal
    const checkoutBtn = buyNowModal.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});
