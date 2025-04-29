// Hàm định dạng giá tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

// Hàm render danh sách thương hiệu
function renderBrands() {
    fetch('/smartstation/src/mvc/controllers/ThuongHieuController.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi tải danh sách thương hiệu');
        }
        return response.json();
    })
    .then(brands => {
        console.log(brands);
        let html = '';
        brands.forEach(brand => {
            // Chuyển TenThuongHieu thành id hợp lệ (lowercase, loại bỏ ký tự đặc biệt)
            const brandId = brand.TenThuongHieu.toLowerCase().replace(/[^a-z0-9]/g, '');
            html += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="${brandId}" data-brand="${brand.TenThuongHieu}" />
                    <label class="form-check-label" for="${brandId}">${brand.TenThuongHieu}</label>
                </div>`;
        });
        document.querySelector('.brand-list').innerHTML = html;
    })
    .catch(error => {
        console.error('Lỗi render thương hiệu:', error);
        document.querySelector('.brand-list').innerHTML = '<div class="text-danger">Lỗi tải danh sách thương hiệu</div>';
    });
}

// Hàm thu thập các bộ lọc
function collectFilters() {
    const filters = {
        brands: [],
        priceRanges: [],
        priceMin: null,
        priceMax: null,
        rams: [],
        pins: []
    };

    // Lấy các hãng được chọn
    document.querySelectorAll('.filter-section .form-check-input[data-brand]').forEach(checkbox => {
        if (checkbox.checked) {
            filters.brands.push(checkbox.getAttribute('data-brand'));
        }
    });

    // Lấy khoảng giá từ checkbox
    if (document.querySelector('#app1').checked) filters.priceRanges.push('0-3000000');
    if (document.querySelector('#app2').checked) filters.priceRanges.push('3000000-6000000');
    if (document.querySelector('#app3').checked || document.querySelector('#app4').checked) filters.priceRanges.push('6000000-10000000');
    if (document.querySelector('#app5').checked) filters.priceRanges.push('10000000-');

    // Lấy giá từ thanh trượt
    const priceSlider = document.querySelector('.price-range .form-range');
    filters.priceMin = parseInt(priceSlider.value);
    filters.priceMax = parseInt(priceSlider.max);

    // Lấy RAM
    document.querySelectorAll('.filter-section .form-check-input[id^="ram"]').forEach(checkbox => {
        if (checkbox.checked) {
            const ramValue = checkbox.nextElementSibling.textContent;
            filters.rams.push(ramValue);
        }
    });

    // Lấy Pin
    document.querySelectorAll('.filter-section .form-check-input[id^="pin"]').forEach(checkbox => {
        if (checkbox.checked) {
            const pinLabel = checkbox.nextElementSibling.textContent;
            if (pinLabel === 'Dưới 3000mAh') filters.pins.push('0-3000');
            else if (pinLabel === '3000 - 4000mAh') filters.pins.push('3000-4000');
            else if (pinLabel === '4000 - 5000mAh') filters.pins.push('4000-5000');
            else if (pinLabel === '5000mAh trở lên') filters.pins.push('5000-');
        }
    });
    console.log(filters);
    return filters;
}

// Hàm xây dựng query string từ bộ lọc
function buildQueryString(filters, page) {
    const params = new URLSearchParams();
    params.append('page', page);

    if (filters.brands.length > 0) {
        params.append('brands', filters.brands.join(','));
    }
    if (filters.priceRanges.length > 0) {
        params.append('priceRanges', filters.priceRanges.join(','));
    }
    if (filters.priceMin) {
        params.append('priceMin', filters.priceMin);
    }
    if (filters.priceMax) {
        params.append('priceMax', filters.priceMax);
    }
    if (filters.rams.length > 0) {
        params.append('rams', filters.rams.join(','));
    }
    if (filters.pins.length > 0) {
        params.append('pins', filters.pins.join(','));
    }

    return params.toString();
}

// Hàm tải sản phẩm với bộ lọc
function loadProducts(page = 1, filters = null) {
    const queryString = filters ? buildQueryString(filters, page) : `page=${page}`;
    console.log(queryString);
    fetch(`/smartstation/src/public/api/SanPhamAPI.php?${queryString}`, {
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
        const products = data.products;
        let productHTML = '';

        if (products && products.length > 0) {
            console.log(products);
            products.forEach(product => {
                const productName = product.name || 'Sản phẩm không xác định';
                const giaGocNum = Number(product.giaGoc);
                const giaGoc = !isNaN(giaGocNum) && product.giaGoc !== null ? formatPrice(giaGocNum) : 'N/A';
                let priceHTML = '';
                if (product.giaGiam !== null && product.giaGiam !== undefined) {
                    const giaGiamNum = Number(product.giaGiam);
                    const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                    priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                } else {
                    priceHTML = giaGoc;
                }
                const imageSrc = product.image ? `data:image/jpeg;base64,${product.image}` : '/smartstation/src/public/img/default.png';
                productHTML += `
                    <div class="col">
                        <div class="product-card" data-bs-toggle="modal" data-bs-target="#productModal" data-product='${JSON.stringify(product)}'>
                            <img src="${imageSrc}" alt="${productName}">
                            <div class="product-name">${productName}</div>
                            <div class="product-specs">RAM: ${product.ram || 'N/A'} - ROM: ${product.rom || 'N/A'}</div>
                            <div class="product-price">${priceHTML}</div>
                        </div>
                    </div>`;
            });
        } else {
            productHTML = '<div class="col text-center">Không có sản phẩm nào.</div>';
        }

        document.querySelector('.product-grid').innerHTML = productHTML;

        // Cập nhật phân trang
        const totalPages = Math.ceil(data.total / data.limit);
        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link page-btn" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        document.querySelector('.pagination').innerHTML = paginationHTML;

        // Gắn sự kiện cho các thẻ sản phẩm
        attachProductCardListeners();
    })
    .catch(error => {
        console.error('Lỗi tải sản phẩm:', error);
        document.querySelector('.product-grid').innerHTML = '<div class="col text-center">Lỗi tải sản phẩm.</div>';
    });
}
// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', () => {
    // Render danh sách thương hiệu
    renderBrands();
    // Tải sản phẩm mặc định (không lọc)
    loadProducts(1);

    // Xử lý sự kiện nút LỌC
    document.getElementById('applyFilterBtn').addEventListener('click', () => {
        const filters = collectFilters();
        loadProducts(1, filters);
    });

    // Xử lý sự kiện thay đổi thanh trượt giá
    const priceSlider = document.querySelector('.price-range .form-range');
    priceSlider.addEventListener('input', () => {
        const value = parseInt(priceSlider.value);
        document.querySelector('.price-range .d-flex span:first-child').textContent = formatPrice(value);
    });

    // Xử lý sự kiện click vào phân trang
    document.querySelector('.pagination').addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.dataset.page);
            const filters = collectFilters();
            loadProducts(page, filters);
        }
    });
});

// Các hàm khác (tái sử dụng từ mã hiện có)
function attachProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const product = JSON.parse(card.dataset.product);
            const productName = product.name || 'Sản phẩm không xác định';
            const giaGocNum = Number(product.giaGoc);
            const giaGoc = !isNaN(giaGocNum) && product.giaGoc !== null ? formatPrice(giaGocNum) : 'N/A';
            let priceHTML = '';
            let discountText = '';
            if (product.giaGiam !== null && product.giaGiam !== undefined) {
                const giaGiamNum = Number(product.giaGiam);
                const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                discountText = product.phanTramGiam ? `Giảm ${product.phanTramGiam}%` : '';
            } else {
                priceHTML = giaGoc;
            }
            loadConfigItem(product.idDSP, product.idCHSP);
            const imageSrc = product.image ? `data:image/jpeg;base64,${product.image}` : '/smartstation/src/public/img/default.png';
            document.querySelector('#modalProductName').textContent = productName;
            document.querySelector('#modalProductSpecs').textContent = `RAM: ${product.ram || 'N/A'} - ROM: ${product.rom || 'N/A'}`;
            document.querySelector('#modalProductPrice').innerHTML = priceHTML;
            document.querySelector('#modalProductDiscount').textContent = discountText;
            document.querySelector('#modalProductPoints').textContent = '';
            document.querySelector('#modalProductRom').textContent = product.rom || 'N/A';
            document.querySelector('#modalProductManHinh').textContent = product.manHinh || 'N/A';
            document.querySelector('#modalProductPin').textContent = product.pin || 'N/A';
            document.querySelector('#modalProductCamera').textContent = product.camera || 'N/A';
            document.querySelector('#modalProductTrangThai').textContent = product.trangThai === "1" ? 'Còn hàng' : 'Hết hàng';

            // Tải ảnh carousel
            fetch(`/smartstation/src/mvc/controllers/AnhController.php?idDSP=${product.idDSP}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi tải ảnh');
                }
                return response.json();
            })
            .then(images => {
                loadCarouselImages(images, product);
                let thumbnailHTML = '';
                if (images && images.length > 0) {
                    images.forEach((image, index) => {
                        const imageSrc = image.Anh ? `data:image/jpeg;base64,${image.Anh}` : '/smartstation/src/public/img/default.png';
                        thumbnailHTML += `
                            <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                        `;
                    });
                } else {
                    thumbnailHTML = `
                        <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                    `;
                }
                document.querySelector('.thumbnail-gallery').innerHTML = thumbnailHTML;
                attachThumbnailListeners();
            })
            .catch(error => {
                console.error('Lỗi tải ảnh:', error);
                const thumbnailHTML = `
                    <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                `;
                document.querySelector('.thumbnail-gallery').innerHTML = thumbnailHTML;
                attachThumbnailListeners();
            });
        });
    });
}

function loadCarouselImages(data, product) {
    const carousel = document.querySelectorAll(".carousel-inner")[1];
    let html = '';
    data.forEach((item) => {
        if (item.IdDongSanPham == product.idDSP && item.IdCHSP == product.idCHSP) {
            html += `<div class="carousel-item active">
                        <img class="d-block w-100" src="data:image/jpeg;base64,${item.Anh}" alt="First slide">
                    </div>`;
        } else {
            html += `<div class="carousel-item">
                        <img class="d-block w-100" src="data:image/jpeg;base64,${item.Anh}" alt="Second slide">
                    </div>`;
        }
    });
    carousel.innerHTML = html;
}

function attachThumbnailListeners() {
    const listImg = document.querySelectorAll("#carouselExampleControls .carousel-inner .carousel-item");
    document.querySelectorAll('.thumbnail-image').forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            listImg.forEach(item => item.classList.remove("active"));
            const index = thumbnail.dataset.index;
            if (listImg[index]) {
                listImg[index].classList.add("active");
            }
            document.querySelectorAll('.thumbnail-image').forEach(img => img.classList.remove('active'));
            thumbnail.classList.add('active');
        });
    });
}

function loadConfigItem(idDSP, idCHSP) {
    fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi tải cấu hình');
        }
        return response.json();
    })
    .then(configs => {
        setUpDataConfigItem(configs, idDSP, idCHSP);
    });
}

function setUpDataConfigItem(product, idDSP, idCHSP) {
    product.forEach((item) => {
        if (item.IdCHSP == idCHSP && item.IdDongSanPham == idDSP) {
            const giaGocNum = Number(item.Gia);
            const giaGoc = !isNaN(giaGocNum) && item.Gia !== null ? formatPrice(giaGocNum) : 'N/A';
            let priceHTML = '';
            let discountText = '';
            if (item.GiaGiam !== null && item.GiaGiam !== undefined) {
                const giaGiamNum = Number(item.GiaGiam);
                const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                discountText = item.PhanTramGiam ? `Giảm ${item.PhanTramGiam}%` : '';
            } else {
                priceHTML = giaGoc;
            }
            document.querySelector('#modalProductName').textContent = item.TenDong;
            document.querySelector('#modalProductSpecs').textContent = `RAM: ${item.Ram || 'N/A'} - ROM: ${item.Rom || 'N/A'}`;
            document.querySelector('#modalProductPrice').innerHTML = priceHTML;
            document.querySelector('#modalProductDiscount').textContent = discountText;
            document.querySelector('#modalProductPoints').textContent = '';
            document.querySelector('#modalProductRom').textContent = item.Rom || 'N/A';
            document.querySelector('#modalProductManHinh').textContent = item.ManHinh || 'N/A';
            document.querySelector('#modalProductPin').textContent = item.Pin || 'N/A';
            document.querySelector('#modalProductCamera').textContent = item.Camera || 'N/A';
            document.querySelector('#modalProductTrangThai').textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
        }
    });

    const ramSet = new Set();
    const colorSet = new Set();
    const ramList = [];
    const colorList = [];

    product.forEach((item) => {
        if (!ramSet.has(item.Ram)) {
            ramSet.add(item.Ram);
            ramList.push({
                Ram: item.Ram,
                IdDongSanPham: item.IdDongSanPham
            });
        }
        if (!colorSet.has(item.MauSac)) {
            colorSet.add(item.MauSac);
            colorList.push(item.MauSac);
        }
    });

    ramList.sort((a, b) => extractNumber(a.Ram) - extractNumber(b.Ram));

    let htmlRam = '', htmlMauSac = '';
    ramList.forEach(item => {
        htmlRam += `<span idDSP="${item.IdDongSanPham}">${item.Ram}</span>`;
    });
    colorList.forEach(color => {
        htmlMauSac += `<span>${color}</span>`;
    });

    document.getElementById("modalProductRam").innerHTML = htmlRam;
    document.getElementById("modalProductMauSac").innerHTML = htmlMauSac;

    handleSelectConfigItem(product);
}

function extractNumber(str) {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

function setUpAfterSelectedRam(product, selectedRam) {
    product.forEach((item) => {
        if (item.Ram == selectedRam) {
            const giaGocNum = Number(item.Gia);
            const giaGoc = !isNaN(giaGocNum) && item.Gia !== null ? formatPrice(giaGocNum) : 'N/A';
            let priceHTML = '';
            let discountText = '';
            if (item.GiaGiam !== null && item.GiaGiam !== undefined) {
                const giaGiamNum = Number(item.GiaGiam);
                const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                discountText = item.PhanTramGiam ? `Giảm ${item.PhanTramGiam}%` : '';
            } else {
                priceHTML = giaGoc;
            }
            document.querySelector('#modalProductName').textContent = item.TenDong;
            document.querySelector('#modalProductSpecs').textContent = `RAM: ${item.Ram || 'N/A'} - ROM: ${item.Rom || 'N/A'}`;
            document.querySelector('#modalProductPrice').innerHTML = priceHTML;
            document.querySelector('#modalProductDiscount').textContent = discountText;
            document.querySelector('#modalProductPoints').textContent = '';
            document.querySelector('#modalProductRom').textContent = item.Rom || 'N/A';
            document.querySelector('#modalProductManHinh').textContent = item.ManHinh || 'N/A';
            document.querySelector('#modalProductPin').textContent = item.Pin || 'N/A';
            document.querySelector('#modalProductCamera').textContent = item.Camera || 'N/A';
            document.querySelector('#modalProductTrangThai').textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
        }
    });
}

function setUpAfterSelectedColor(product, selectedColor, ram) {
    product.forEach((item) => {
        if (item.Ram == ram && item.MauSac == selectedColor) {
            const giaGocNum = Number(item.Gia);
            const giaGoc = !isNaN(giaGocNum) && item.Gia !== null ? formatPrice(giaGocNum) : 'N/A';
            let priceHTML = '';
            let discountText = '';
            if (item.GiaGiam !== null && item.GiaGiam !== undefined) {
                const giaGiamNum = Number(item.GiaGiam);
                const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                discountText = item.PhanTramGiam ? `Giảm ${item.PhanTramGiam}%` : '';
            } else {
                priceHTML = giaGoc;
            }
            document.querySelector('#modalProductName').textContent = item.TenDong;
            document.querySelector('#modalProductSpecs').textContent = `RAM: ${item.Ram || 'N/A'} - ROM: ${item.Rom || 'N/A'}`;
            document.querySelector('#modalProductPrice').innerHTML = priceHTML;
            document.querySelector('#modalProductDiscount').textContent = discountText;
            document.querySelector('#modalProductPoints').textContent = '';
            document.querySelector('#modalProductRom').textContent = item.Rom || 'N/A';
            document.querySelector('#modalProductManHinh').textContent = item.ManHinh || 'N/A';
            document.querySelector('#modalProductPin').textContent = item.Pin || 'N/A';
            document.querySelector('#modalProductCamera').textContent = item.Camera || 'N/A';
            document.querySelector('#modalProductTrangThai').textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
        }
    });
}

function handleSelectConfigItem(product) {
    let ram;
    const ramOptions = document.querySelectorAll('#modalProductRam span');
    ramOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedRam = e.currentTarget.innerText;
            let htmlMauSac = '';
            product.forEach((item) => {
                if (item.Ram === selectedRam) {
                    htmlMauSac += `<span idchsp=${item.IdCHSP}>${item.MauSac}</span>`;
                }
            });
            setUpAfterSelectedRam(product, selectedRam);
            ram = selectedRam;
            const colorContainer = document.getElementById("modalProductMauSac");
            colorContainer.innerHTML = htmlMauSac;
            const mauSacOptions = colorContainer.querySelectorAll('span');
            mauSacOptions.forEach(colorOption => {
                colorOption.addEventListener('click', (e) => {
                    mauSacOptions.forEach(item => item.classList.remove('selected'));
                    colorOption.classList.add('selected');
                    const selectedColor = e.currentTarget.innerText;
                    setUpAfterSelectedColor(product, selectedColor, ram);
                });
            });
            ramOptions.forEach(item => item.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

function filterNewProducts(limit = 10) {
    fetch(`/smartstation/src/public/api/SanPhamAPI.php?sort=latest&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi tải sản phẩm mới nhất');
        }
        return response.json();
    })
    .then(data => {
        const products = data.products || [];
        let productHTML = '';

        if (products.length > 0) {
            products.forEach(product => {
                const productName = product.name || 'Sản phẩm không xác định';
                const giaGocNum = Number(product.giaGoc);
                const giaGoc = !isNaN(giaGocNum) && product.giaGoc !== null ? formatPrice(giaGocNum) : 'N/A';
                let priceHTML = '';
                if (product.giaGiam !== null && product.giaGiam !== undefined) {
                    const giaGiamNum = Number(product.giaGiam);
                    const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                    priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                } else {
                    priceHTML = giaGoc;
                }
                const imageSrc = product.image ? `data:image/jpeg;base64,${product.image}` : '/smartstation/src/public/img/default.png';
                productHTML += `
                    <div class="col">
                        <div class="product-card" data-bs-toggle="modal" data-bs-target="#productModal" data-product='${JSON.stringify(product)}'>
                            <img src="${imageSrc}" alt="${productName}">
                            <div class="product-name">${productName}</div>
                            <div class="product-specs">RAM: ${product.ram || 'N/A'} - ROM: ${product.rom || 'N/A'}</div>
                            <div class="product-price">${priceHTML}</div>
                        </div>
                    </div>`;
            });
        } else {
            productHTML = '<div class="col text-center">Không có sản phẩm mới.</div>';
        }

        // Render vào container .product-grid (giống loadProducts)
        const productContainer = document.querySelector('.product-grid');
        if (productContainer) {
            productContainer.innerHTML = productHTML;
        } else {
            console.warn('Container .product-grid không tồn tại trong DOM');
        }

        // Gắn sự kiện cho các thẻ sản phẩm
        attachProductCardListeners();

        // Cập nhật phân trang (hiển thị 1 trang vì giới hạn 10 sản phẩm)
        const paginationContainer = document.querySelector('.pagination');
        if (paginationContainer) {
            paginationContainer.innerHTML = `
                <li class="page-item active">
                    <a class="page-link page-btn" href="#" data-page="1">1</a>
                </li>
            `;
        }
    })
    .catch(error => {
        console.error('Lỗi tải sản phẩm mới nhất:', error);
        const productContainer = document.querySelector('.product-grid');
        if (productContainer) {
            productContainer.innerHTML = '<div class="col text-center">Lỗi tải sản phẩm mới.</div>';
        }
    });
}