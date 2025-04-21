// singleProductCheckout.js
const buyNowModal = document.getElementById('buyNowModal');
const buyNowQuantityElement = buyNowModal.querySelector('.quantity-value');
const buyNowBtnDecrement = buyNowModal.querySelector('.btn-decrement');
const buyNowBtnIncrement = buyNowModal.querySelector('.btn-increment');
let buyNowPriceElement = buyNowModal.querySelector('.text-success');
const idNguoiDung = getCookieValue('user');
let isBuyNowQuantitySelectorsSetup = false;

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}


function parseFormattedPrice(formattedPrice) {
    return parseInt(formattedPrice.replace(/\./g, '').replace(/\s?VNĐ/i, '').trim());
}


// Update quantity buttons state
// function updateQuantityButtons(value, btnDecrement, btnIncrement) {
//     btnDecrement.disabled = value <= 1;
//     btnIncrement.disabled = value >= 10;
// }

// // Handle modal quantity selectors (single product)
// function setupBuyNowQuantitySelectors() {
//     updateQuantityButtons(1, buyNowBtnDecrement, buyNowBtnIncrement);
//     if (isBuyNowQuantitySelectorsSetup) return;

//     buyNowPriceElement = buyNowModal.querySelector('.text-success');
//     if (!buyNowPriceElement || !buyNowPriceElement.dataset.price) {
//         console.error("Không tìm thấy giá sản phẩm");
//         return;
//     }

//     const price = parseFormattedPrice(buyNowPriceElement.dataset.price.replace("đ", "").trim());

//     buyNowBtnIncrement.addEventListener('click', () => {
//         let value = parseInt(buyNowQuantityElement.textContent);
//         if (value < 10) {
//             buyNowQuantityElement.textContent = value + 1;
//             updateQuantityButtons(value + 1, buyNowBtnDecrement, buyNowBtnIncrement);
//             updateModalTotalPrice(price, value + 1);
//         }
//     });

//     buyNowBtnDecrement.addEventListener('click', () => {
//         let value = parseInt(buyNowQuantityElement.textContent);
//         if (value > 1) {
//             buyNowQuantityElement.textContent = value - 1;
//             updateQuantityButtons(value - 1, buyNowBtnDecrement, buyNowBtnIncrement);
//             updateModalTotalPrice(price, value - 1);
//         }
//     });

//     isBuyNowQuantitySelectorsSetup = true;
// }

function updateQuantityButtons(value) {
    buyNowBtnDecrement.disabled = value <= 1;
    buyNowBtnIncrement.disabled = value >= 10;
}

// Update total price in modal (single product)
function updateModalTotalPrice(price, quantity) {

    const total = price * quantity;
    const modalTotalPrice = document.querySelector('.modal-body #total-price');
    if (modalTotalPrice) {
        modalTotalPrice.innerText = `Tổng tiền: ${formatPrice(total)}`;
    }
}

function incrementQuantity() {
    let value = parseInt(buyNowQuantityElement.textContent);
    if (value < 10) {
        buyNowQuantityElement.textContent = value + 1;
        updateQuantityButtons(value + 1);
        updateModalTotalPrice(price, value + 1);
    }
}

function decrementQuantity() {
    let value = parseInt(buyNowQuantityElement.textContent);
    if (value > 1) {
        buyNowQuantityElement.textContent = value - 1;
        updateQuantityButtons(value - 1);
        updateModalTotalPrice(price, value - 1);
    }
}

function setupModalQuantitySelectors() {
    updateQuantityButtons(1);
    priceElement = buyNowModal.querySelector('.text-success');
    price = parseFormattedPrice((priceElement.dataset.price).replace("đ", "").trim());

    // Gỡ sự kiện cũ nếu đã setup
    if (isBuyNowQuantitySelectorsSetup) {
        buyNowBtnIncrement.removeEventListener('click', incrementQuantity);
        buyNowBtnDecrement.removeEventListener('click', decrementQuantity);
    }

    buyNowBtnIncrement.addEventListener('click', incrementQuantity);
    buyNowBtnDecrement.addEventListener('click', decrementQuantity);

    isBuyNowQuantitySelectorsSetup = true;
}


// Handle address input editability
function handleAddressInput(modalId) {
    const addressInput = document.getElementById(modalId === 'buyNowModal' ? 'address-input' : 'checkoutAddressInput');
    const editAddressRadio = document.getElementById(modalId === 'buyNowModal' ? 'edit-address' : 'checkoutEditAddress');

    editAddressRadio.addEventListener('change', () => {
        addressInput.disabled = !editAddressRadio.checked;
    });
}

// Get cookie value
function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    return match ? match[2] : null;
}

// Handle buy now click
function handleClickMuaNgay() {
    const elementDSP = document.querySelector('#modalProductRam .selected');
    const elementCHSP = document.querySelector('#modalProductMauSac .selected');

    if (elementDSP && elementCHSP) {
        const idDSP = elementDSP.getAttribute('iddsp');
        const idCHSP = elementCHSP.getAttribute('idchsp');
        const priceProduct = document.querySelector('#modalProductPrice').innerText;
        console.log(priceProduct);
        getAnh(idCHSP, idDSP, priceProduct);
    } else {
        alert('Chọn phiên bản!');
    }
}

// Fetch product image
function getAnh(idCHSP, idDSP, priceProduct) {
    fetch(`/smartstation/src/mvc/controllers/AnhController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Lỗi mạng');
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
            alert("Lỗi ảnh hoặc thứ gì khác");
        }
    })
    .catch(error => {
        console.error("Lỗi khi tải ảnh:", error);
    });
}

function handleCloseModal()
{
    const myModal = bootstrap.Modal.getInstance(document.getElementById('buyNowModal'));
    myModal.hide();
}

// Set product and user information
async function SetInfor(product) {
    try {
        const userResponse = await fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${idNguoiDung}`);
        const userData = await userResponse.json();
        document.getElementById('FullName').value = userData.HoVaTen || '';
        document.getElementById('PhoneNumber').value = userData.SoDienThoai || '';
        document.getElementById('Email').value = userData.Email || '';
        document.getElementById('address-input').value = userData.DiaChi || '';

        const productResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${product.idDSP}&idCHSP=${product.idCHSP}`);
        const productData = await productResponse.json();

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
                    <span class="config-label">Độ phân giải</span>
                    <span class="config-value">${productData.Camera}</span>
                </div>
            </div>`;
        const productContainer = buyNowModal.querySelector(".col-md-6");
        productContainer.innerHTML = html;
        productContainer.dataset.idCHSP = product.idCHSP;
        productContainer.dataset.idDSP = product.idDSP;
        console.log(buyNowModal.querySelector('.modal-body .total-price'));
        console.log(product.price);
        buyNowModal.querySelector('.modal-body .total-price').innerText = `Tổng tiền: ${product.price}`;
        buyNowQuantityElement.innerText = 1;

        const myModal = new bootstrap.Modal(buyNowModal);
        myModal.show();
        setupModalQuantitySelectors();
        handleAddressInput('buyNowModal');
        document.getElementById('edit-address').checked = false;
        document.getElementById('address-input').disabled = true;
    } catch (error) {
        console.error("Lỗi khi thiết lập thông tin:", error);
        alert("Lỗi: " + error.message);
    }
}

// Get account ID
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

// Handle single product checkout
async function handleCheckout() {
    try {
        const radioBtn = document.getElementById('edit-address');
        const newAddress = document.getElementById('address-input').value;
        const quantity = parseInt(buyNowQuantityElement.textContent) || 1;
        const priceElement = buyNowModal.querySelector('.text-success');
        const totalPrice = parseFormattedPrice(priceElement.dataset.price.replace("đ", "").trim()) * quantity;
        const idCHSP = buyNowModal.querySelector('.col-md-6').dataset.idCHSP;
        const idDongSanPham = buyNowModal.querySelector('.col-md-6').dataset.idDSP;
        const currentDate = new Date().toISOString().slice(0, 10);
        const idTaiKhoan = await getIdTaiKhoan(idNguoiDung);
        const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?idCHSP=${idCHSP}&idDongSanPham=${idDongSanPham}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (!data || !data.Imei) {
            throw new Error("Không tìm thấy sản phẩm chi tiết hoặc đã hết hàng");
        }
        const imei = data.Imei;
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
        if (!hoaDonDataResult.HoaDon) {
            throw new Error("Thêm hóa đơn thất bại");
        }
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
        const idHoaDon = hoaDonDataResult.HoaDon.IdHoaDon;

        const ctHoaDonData = {
            IdHoaDon: idHoaDon,
            GiaTien: totalPrice / quantity,
            SoLuong: quantity,
            Imei: imei
        };

        const ctHoaDonResponse = await fetch('/smartstation/src/mvc/controllers/CTHoaDonController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ctHoaDonData)
        });
        const ctHoaDonResult = await ctHoaDonResponse.json();
        if (ctHoaDonResult.message.includes("thành công")) {
            alert("Thanh toán thành công!");
            const myModal = bootstrap.Modal.getInstance(buyNowModal);
            myModal.hide();
        } else {
            throw new Error("Thêm chi tiết hóa đơn thất bại");
        }
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        alert("Lỗi thanh toán: " + error.message);
    }
}
handleAddressInput('buyNowModal');
// Handle buy now button click
// function handleClickBuyNow() {
//     handleClickMuaNgay();
// }
