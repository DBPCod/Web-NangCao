const modal = document.getElementById('myModal');
const quantityElement = modal.querySelector('.quantity-value');
const btnDecrement = modal.querySelector('.btn-decrement');
const btnIncrement = modal.querySelector('.btn-increment');
var priceElement = modal.querySelector('.text-success');
var idNguoiDung = getCookieValue('user');
// Function to format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}


function parseFormattedPrice(formattedPrice) {
    return parseInt(formattedPrice.replace(/\./g, '').replace(/\s?VNĐ/i, '').trim());
}

// Function to calculate and update total price
// function updateTotalPrice() {
//     let total = 0;
//     const productDetail = document.querySelectorAll('.product-details');
//     if (productDetail.length !== 0) {
//         productDetail.forEach(product => {
//             const price = parseInt(product.dataset.price);
//             const quantity = parseInt(product.querySelector('.quantity-value').textContent);
//             total += price * quantity;
//         });
//         document.getElementById('total-price').textContent = `Tổng tiền: ${formatPrice(total)}`;
//     }
// }

// Function to update total price in modal
//dùng cho 1 sản phẩm
function updateModalTotalPrice(price, quantity) {

    const total = price * quantity;
    const modalTotalPrice = document.querySelector('.modal-body .total-price');
    if (modalTotalPrice) {
        modalTotalPrice.textContent = `Tổng tiền: ${formatPrice(total)}`;
    }
}

// Handle quantity selectors, delete, and details for all products
document.querySelectorAll('.product-details').forEach(product => {
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

// Handle modal quantity selectors
//
//dung cho nhieu san pham
function setupModalQuantitySelectors() {
    priceElement = modal.querySelector('.text-success');
    console.log(priceElement);
    const price = parseFormattedPrice((priceElement.dataset.price).replace("đ", "").trim());
    function updateQuantityButtons(value) {
        btnDecrement.disabled = value <= 1;
        btnIncrement.disabled = value >= 10;
    }

    btnDecrement.addEventListener('click', () => {
        let value = parseInt(quantityElement.textContent);
        if (value > 1) {
            quantityElement.textContent = value - 1;
            updateQuantityButtons(value - 1);
            updateModalTotalPrice(price, value - 1);
        }
    });

    btnIncrement.addEventListener('click', () => {
        let value = parseInt(quantityElement.textContent);
        if (value < 10) {
            quantityElement.textContent = value + 1;
            updateQuantityButtons(value + 1);
            updateModalTotalPrice(price, value + 1);
        }
    });

    // Initial button state
    updateQuantityButtons(1);
}

// Call setup for modal quantity selectors when modal is shown
// function loadCheckoutModal()
// {
//     const myModal = document.getElementById('myModal');
//     myModal.addEventListener('show.bs.modal', function (event) {
//         const button = event.relatedTarget; // Button that triggered the modal
//         const actionType = button.getAttribute('data-title'); // Get data-title value

//         if (actionType === 'MuaNgay') {
//             console.log('Modal opened from MUA NGAY');
//             setupModalQuantitySelectors(); // Setup quantity selectors for modal
//         } else if (actionType === 'ThanhToan') {
//             console.log('Modal opened from THANH TOÁN');
//             setupModalQuantitySelectors(); // Setup quantity selectors for modal
//         }
//     });
// }

// Handle address input editability
function handleAddressInput()
{
    const addressInput = document.getElementById('address-input');
    const editAddressRadio = document.getElementById('edit-address');

    editAddressRadio.addEventListener('change', () => {
        if (editAddressRadio.checked) {
            addressInput.disabled = false;
        } else {
            addressInput.disabled = true;
        }
    });
}

// Initial total price calculation
// updateTotalPrice();
handleAddressInput();
// setupModalQuantitySelectors();


function getCookieValue(name) 
    {
      const regex = new RegExp(`(^| )${name}=([^;]+)`)
      const match = document.cookie.match(regex)
      if (match) {
        return match[2]
      }
   }


function handleClickMuaNgay()
{
    var elementDSP = document.querySelector('#modalProductRam .selected');
    var elementCHSP = document.querySelector('#modalProductMauSac .selected');
    
    if(elementDSP && elementCHSP)
    {
        // const actionType = this.getAttribute('data-title');
            var idDSP = elementDSP.getAttribute('iddsp');
            var idCHSP = elementCHSP.getAttribute('idchsp');
            var priceProduct = document.querySelector('#modalProductPrice').innerText;
            console.log(document.querySelector('#modalProductPrice').innerText);
            getAnh(idCHSP,idDSP,priceProduct);
    }
    else
    {
        alert('Chọn phiên bản!');
    }
}


function getAnh(idCHSP,idDSP,priceProduct)
{
    fetch(`/smartstation/src/mvc/controllers/AnhController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi mạng');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if(data.length!=0)
        {
            imageSrc = `data:image/jpeg;base64,${data[0].Anh}`;
            // Tạo đối tượng sản phẩm
            const product = {
                img: imageSrc,
                idDSP: idDSP,  // Thêm idDSP và idCHSP vào sản phẩm nếu cần
                idCHSP: idCHSP,
                price: priceProduct
            };
            SetInfor(product);
        }
        else
        {
            alert("Lỗi ảnh hoặc thứ gì khác");
        }
        
        
    })
    .catch(error => {
        console.error("Lỗi khi tải ảnh:", error);
    });
}

// Get customer information and set
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
        
        const productContainer = document.querySelector(".col-md-6");
        productContainer.innerHTML = html;
        productContainer.dataset.idCHSP = product.idCHSP;
        productContainer.dataset.idDSP = product.idDSP;
        document.querySelector('.modal-body .total-price').innerText = `Tổng tiền: ${product.price}`;
        setupModalQuantitySelectors();
        quantityElement.innerText = 1;

        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
        document.getElementById('edit-address').checked=false;
        document.getElementById('address-input').disabled = true;

    } catch (error) {
        console.error("Lỗi khi thiết lập thông tin:", error);
        alert("Lỗi: " + error.message);
    }
}


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
        console.error("Lỗi khi lấy IdTaiKhoan:", error);
        throw error;
    }
}

async function handleCheckout() {
    try {
        const radioBtn = document.getElementById('edit-address');
        const newAddress = document.getElementById('address-input').value;
        const quantity = parseInt(quantityElement.textContent) || 1;
        const priceElement = modal.querySelector('.text-success');
        const totalPrice = parseFormattedPrice(priceElement.dataset.price.replace("đ", "").trim()) * quantity;
        const idCHSP = modal.querySelector('.col-md-6').dataset.idCHSP;
        const idDongSanPham = modal.querySelector('.col-md-6').dataset.idDSP;
        const currentDate = new Date().toISOString().slice(0, 10);

        const idTaiKhoan = await getIdTaiKhoan(idNguoiDung);

        
        if (radioBtn.checked && newAddress) {
            console.log(newAddress);
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
console.log(idCHSP, idDongSanPham);
        const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?idCHSP=${idCHSP}&idDongSanPham=${idDongSanPham}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (!data || !data.Imei) {
            throw new Error("Không tìm thấy sản phẩm chi tiết hoặc đã hết hàng");
        }
        const imei = data.Imei;
        console.log(totalPrice);
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
            const myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
            myModal.hide();
        } else {
            throw new Error("Thêm chi tiết hóa đơn thất bại");
        }
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        alert("Lỗi thanh toán: " + error.message);
    }
}

