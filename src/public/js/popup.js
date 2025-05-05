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
        loadItemInCart();
    });

    function formatVND(number) {
        return number.toLocaleString("vi-VN") + " VNĐ";
    }

    function loadItemInCart() {
        // Chọn container chứa các cart-item
        var cartItemsContainer = document.querySelector(".cart-items");
        var html = '';
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Kiểm tra nếu giỏ hàng trống
        if (cart.length == 0) {
            document.querySelector(".cart-empty").style.display = "block";
            cartItemsContainer.style.display = "none";
            document.getElementById("totalPrice").innerText = formatVND(0);
        } else {
            document.querySelector(".cart-empty").style.display = "none";
            cartItemsContainer.style.display = "block";
            
            // Tính tổng giá trị dựa trên giá thực tế (giá khuyến mãi nếu có)
            const totalPrice = cart.reduce((sum, item) => {
                // Sử dụng giá khuyến mãi nếu có, nếu không thì dùng giá gốc
                let price;
                if (item.discountPrice && item.discountPrice.trim() !== '') {
                    price = parseFloat(item.discountPrice.replace(/[^\d]/g, ""));
                } else {
                    price = parseFloat(item.price.replace(/[^\d]/g, ""));
                }
                return sum + price * item.quantity;
            }, 0);
            
            document.getElementById("totalPrice").innerText = formatVND(totalPrice);
            
            cart.forEach((product, index) => {
                // Xử lý hiển thị giá
                let priceHTML = '';
                if (product.discountPrice && product.discountPrice.trim() !== '') {
                    // Có giá khuyến mãi - hiển thị cả hai giá
                    priceHTML = `<span class="text-decoration-line-through text-muted me-2">${product.price}</span><span class="text-success">${product.discountPrice}</span>`;
                } else {
                    // Không có giá khuyến mãi - chỉ hiển thị giá gốc
                    priceHTML = `<span>${product.price}</span>`;
                }
                
                html += `
                    <div class="cart-item d-flex align-items-center mb-3" data-index="${index}">
                        <div class="cart-item-info d-flex align-items-center">
                            <img src="${product.img}" alt="${product.name}" class="img-thumbnail me-3" style="width: 70px;">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${product.name} - ${product.ram} - Màu ${product.color}</h6>
                                <div class="product-price">${priceHTML}</div>
                            </div>
                        </div>
                        <div class="cart-item-controls d-flex align-items-center ms-auto">
                            <div class="input-group input-group-sm quantity-group" style="width: 110px;">
                                <button class="btn btn-outline-secondary btn-decrease" type="button">-</button>
                                <input type="number" class="form-control text-center quantity-input" min="1" value="${product.quantity || 1}">
                                <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
                            </div>
                            <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                        </div>
                    </div>`;
            });

            // Gán HTML vào container
            cartItemsContainer.innerHTML = html;
            // Gắn sự kiện cho các nút
            attachEventListeners();
        }
    }
    
    function attachEventListeners() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Xử lý nút tăng số lượng
        document.querySelectorAll(".btn-increase").forEach((button, index) => {
            button.addEventListener("click", async () => {
                const product = cart[index];
                const stock = await fetchStock(product.idCHSP, product.idDSP);
                
                if ((product.quantity || 1) < stock) {
                    product.quantity = (product.quantity || 1) + 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    loadItemInCart(); // Tải lại giỏ hàng
                } else {
                    toast({
                        title: "Cảnh báo",
                        message: `Số lượng tồn kho chỉ còn ${stock} sản phẩm!`,
                        type: "warning",
                        duration: 3000,
                    });
                }
            });
        });

        // Xử lý nút giảm số lượng
        document.querySelectorAll(".btn-decrease").forEach((button, index) => {
            button.addEventListener("click", () => {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    loadItemInCart(); // Tải lại giỏ hàng
                }
            });
        });

        // Xử lý nút xóa
        document.querySelectorAll(".btn-danger").forEach((button, index) => {
            button.addEventListener("click", () => {
                cart.splice(index, 1); // Xóa sản phẩm khỏi mảng
                localStorage.setItem('cart', JSON.stringify(cart));
                loadItemCountInCart(); // Tải lại giỏ hàng
                loadItemInCart();
            });
        });
    }
    
    // Gọi hàm khi trang được tải
    // document.addEventListener("DOMContentLoaded", loadItemInCart);

    //Xử lý sự kiện click thêm vào giỏ hàng
    var btnAddCart = document.querySelector(".btn-add-to-cart");
    btnAddCart.addEventListener("click", () => {
        // Log cấu trúc HTML của phần tử giá
        const priceElement = document.querySelector("#modalProductPrice");
        console.log("Price element HTML:", priceElement ? priceElement.innerHTML : "null");
        
        var rom = document.querySelector("#modalProductRom").innerText;
        var screenSize= document.querySelector("#modalProductManHinh").innerText;
        var camera= document.querySelector("#modalProductCamera").innerText;
        var pin= document.querySelector("#modalProductPin").innerText;
        var nameSP = document.querySelector("#modalProductName").innerText;
        var ramSP = document.querySelector("#modalProductRam .selected").innerText;
        var colorSP = document.querySelector("#modalProductMauSac .selected").innerText;
        var priceSP = document.querySelector("#modalProductPrice").innerText;
        var statusProduct = document.querySelector("#modalProductTrangThai").innerText;
        var idDSP = document.querySelector('#modalProductRam .selected').getAttribute('iddsp');
        var idCHSP = document.querySelector('#modalProductMauSac .selected').getAttribute('idchsp');

        if (statusProduct == "Hết hàng") {
            toast({
                title: "Cảnh báo",
                message: "Rất xin lỗi quý khách, sản phẩm tạm hết hàng, xin chọn sản phẩm khác.",
                type: "warning",
                duration: 3000,
            });
            return;
        }

        // Lấy ảnh của sản phẩm
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
            const imageSrc = `data:image/jpeg;base64,${data[0].Anh}`;
            
            // Lấy giỏ hàng hiện tại từ localStorage (nếu có)
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
            const existingProductIndex = cart.findIndex(item => item.idDSP === idDSP && item.idCHSP === idCHSP);
            
            if (existingProductIndex !== -1) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
                cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadItemCountInCart();
                
                toast({
                    title: "Thành công",
                    message: "Đã thêm sản phẩm vào giỏ hàng",
                    type: "success",
                    duration: 3000,
                });
                return;
            }

            // Xử lý giá gốc và giá khuyến mãi
            let originalPrice = '';
            let discountPrice = '';

            // Kiểm tra nếu có giá khuyến mãi
            const priceElement = document.querySelector("#modalProductPrice");

            // Log để debug
            console.log("Price element:", priceElement);
            console.log("Price element HTML:", priceElement ? priceElement.innerHTML : "null");

            if (priceElement && priceElement.querySelector('.text-decoration-line-through')) {
                // Có giá khuyến mãi - lấy cả hai giá
                originalPrice = priceElement.querySelector('.text-decoration-line-through').innerText;
                
                // Kiểm tra xem phần tử .text-success có tồn tại không
                const discountElement = priceElement.querySelector('.text-success');
                if (discountElement) {
                    discountPrice = discountElement.innerText;
                } else {
                    // Nếu không tìm thấy phần tử .text-success, thử tìm phần tử khác
                    // Ví dụ: phần tử thứ hai sau phần tử gạch ngang
                    const priceNodes = priceElement.childNodes;
                    for (let i = 0; i < priceNodes.length; i++) {
                        if (priceNodes[i].contains && priceNodes[i].contains(priceElement.querySelector('.text-decoration-line-through'))) {
                            if (i + 1 < priceNodes.length && priceNodes[i + 1].textContent) {
                                discountPrice = priceNodes[i + 1].textContent.trim();
                                break;
                            }
                        }
                    }
                    
                    // Nếu vẫn không tìm thấy, sử dụng giá gốc
                    if (!discountPrice) {
                        discountPrice = originalPrice;
                    }
                }
                
                // Log để debug
                console.log("Giá gốc:", originalPrice);
                console.log("Giá khuyến mãi:", discountPrice);
            } else {
                // Không có giá khuyến mãi - chỉ lấy giá gốc
                originalPrice = priceSP;
                discountPrice = '';
                
                // Log để debug
                console.log("Chỉ có giá gốc:", originalPrice);
            }

            // Tạo đối tượng sản phẩm mới
            const product = {
                rom: rom,
                screenSize: screenSize,
                camera: camera,
                pin: pin,
                img: imageSrc,
                name: nameSP,
                ram: ramSP,
                color: colorSP,
                price: originalPrice,
                discountPrice: discountPrice,
                quantity: 1,
                idDSP: idDSP,
                idCHSP: idCHSP
            };

            // Log sản phẩm để debug
            console.log("Sản phẩm thêm vào giỏ hàng:", product);

            // Thêm sản phẩm mới vào giỏ hàng
            cart.push(product);

            // Lưu lại giỏ hàng đã cập nhật vào localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Cập nhật số lượng sản phẩm trong giỏ hàng
            loadItemCountInCart();

            // Thêm thông báo toast khi thêm sản phẩm thành công
            toast({
                title: "Thành công",
                message: "Đã thêm sản phẩm vào giỏ hàng",
                type: "success",
                duration: 3000,
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải ảnh:", error);
        });
    });
    
    
    loadItemCountInCart();

    function loadItemCountInCart()
    {
        // Lấy giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalQuantity = 0;
        cart.forEach(product => {
            totalQuantity += product.quantity;  // Cộng dồn số lượng của mỗi sản phẩm
        });
        var itemCountInCart = document.querySelector(".cart-badge");
        itemCountInCart.innerText = totalQuantity;
    }

    // Kiểm tra form đăng ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const usernameInput = document.getElementById('registerUsername');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const fullNameInput = document.getElementById('fullName');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const addressInput = document.getElementById('address');

        const usernameError = document.getElementById('usernameError');
        const passwordLengthError = document.getElementById('passwordLengthError');
        const passwordMatchError = document.getElementById('passwordMatchError');
        const passwordMatchSuccess = document.getElementById('passwordMatchSuccess');
        const fullNameError = document.getElementById('fullNameError');
        const phoneError = document.getElementById('phoneError');
        const emailError = document.getElementById('emailError');
        const addressError = document.getElementById('addressError');

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

        // Kiểm tra thời gian thực khi người dùng nhập
        usernameInput.addEventListener('input', function () {
            if (this.value.trim() === '') {
                usernameError.style.display = 'block';
            } else {
                usernameError.style.display = 'none';
            }
        });

        passwordInput.addEventListener('input', function () {
            const password = this.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password.length < 8) {
                passwordLengthError.style.display = 'block';
            } else {
                passwordLengthError.style.display = 'none';
            }

            if (password !== confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'block';
                passwordMatchSuccess.style.display = 'none';
            } else if (password === confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'block';
            } else {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'none';
            }
        });

        confirmPasswordInput.addEventListener('input', function () {
            const password = passwordInput.value;
            const confirmPassword = this.value;

            if (password !== confirmPassword) {
                passwordMatchError.style.display = 'block';
                passwordMatchSuccess.style.display = 'none';
            } else if (password === confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'block';
            } else {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'none';
            }
        });

        fullNameInput.addEventListener('input', function () {
            if (this.value.trim() === '') {
                fullNameError.style.display = 'block';
            } else {
                fullNameError.style.display = 'none';
            }
        });

        phoneInput.addEventListener('input', function () {
            if (!isValidPhone(this.value)) {
                phoneError.style.display = 'block';
            } else {
                phoneError.style.display = 'none';
            }
        });

        emailInput.addEventListener('input', function () {
            if (!isValidEmail(this.value)) {
                emailError.style.display = 'block';
            } else {
                emailError.style.display = 'none';
            }
        });

        addressInput.addEventListener('input', function () {
            if (this.value.trim() === '') {
                addressError.style.display = 'block';
            } else {
                addressError.style.display = 'none';
            }
        });

        // Kiểm tra khi gửi form
        registerForm.addEventListener('submit', function (e) {
            let hasError = false;

            if (usernameInput.value.trim() === '') {
                usernameError.style.display = 'block';
                hasError = true;
            } else {
                usernameError.style.display = 'none';
            }

            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (password.length < 8) {
                passwordLengthError.style.display = 'block';
                hasError = true;
            } else {
                passwordLengthError.style.display = 'none';
            }

            if (password !== confirmPassword) {
                passwordMatchError.style.display = 'block';
                passwordMatchSuccess.style.display = 'none';
                hasError = true;
            } else if (password === confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'block';
            }

            if (fullNameInput.value.trim() === '') {
                fullNameError.style.display = 'block';
                hasError = true;
            } else {
                fullNameError.style.display = 'none';
            }

            if (!isValidPhone(phoneInput.value)) {
                phoneError.style.display = 'block';
                hasError = true;
            } else {
                phoneError.style.display = 'none';
            }

            if (!isValidEmail(emailInput.value)) {
                emailError.style.display = 'block';
                hasError = true;
            } else {
                emailError.style.display = 'none';
            }

            if (addressInput.value.trim() === '') {
                addressError.style.display = 'block';
                hasError = true;
            } else {
                addressError.style.display = 'none';
            }

            if (hasError) {
                e.preventDefault();
                toast({
                    title: 'Lỗi',
                    message: 'Đăng ký thất bại, vui lòng thử lại!',
                    type: 'error',
                    duration: 3000
                });
            }
            toast({
                title: 'Thành công',
                message: 'Đăng ký thành công!',
                type: 'success',
                duration: 3000
            });
        });
    }
});

// Hàm xử lý mouseenter
function handleMouseEnter() {
    const accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.style.display = 'block';
}

// Hàm xử lý mouseleave
function handleMouseLeave() {
    const accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.style.display = 'none';
}

//hiển thị bảng câp nhật thông tin 
function showTab(tabName) {
    // Ẩn tất cả tab
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Xóa class active khỏi tất cả nút
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hiển thị tab được chọn
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    } else {
        console.error(`Không tìm thấy tab với id: ${tabName}`);
    }

    // Thêm class active cho nút
    const selectedBtn = document.querySelector(`button[onclick="showTab('${tabName}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    } else {
        console.error(`Không tìm thấy nút với onclick: showTab('${tabName}')`);
    }
}

// Thêm hàm kiểm tra tồn kho
async function fetchStock(idCHSP, idDSP) {
    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}&idCHSP=${idCHSP}`);
        if (!response.ok) throw new Error('Lỗi mạng khi lấy số lượng tồn kho');
        const data = await response.json();
        return data.SoLuong || 0;
    } catch (error) {
        console.error("Lỗi khi lấy số lượng tồn kho:", error);
        return 0;
    }
}

//tang so luong cua cart
document.addEventListener('DOMContentLoaded', function () {
    // Xử lý khi người dùng thay đổi giá trị trong input
    document.addEventListener('change', async function(e) {
        if (e.target && e.target.classList.contains('quantity-input')) {
            const input = e.target;
            const cartItemElement = input.closest('.cart-item');
            const index = Array.from(document.querySelectorAll('.cart-item')).indexOf(cartItemElement);
            
            if (index !== -1) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const product = cart[index];
                const stock = await fetchStock(product.idCHSP, product.idDSP);
                
                let value = parseInt(input.value);
                if (isNaN(value) || value < 1) value = 1;
                if (value > stock) {
                    value = stock;
                    toast({
                        title: "Cảnh báo",
                        message: `Số lượng tồn kho chỉ còn ${stock} sản phẩm!`,
                        type: "warning",
                        duration: 3000,
                    });
                }
                
                input.value = value;
                product.quantity = value;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadItemInCart();
            }
        }
    }, true);

    // Giữ nguyên các event listeners khác
    document.querySelectorAll('.btn-increase').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            // Kích hoạt sự kiện change để kiểm tra tồn kho
            input.dispatchEvent(new Event('change'));
        });
    });

    document.querySelectorAll('.btn-decrease').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                // Kích hoạt sự kiện change để cập nhật giỏ hàng
                input.dispatchEvent(new Event('change'));
            }
        });
    });
});



