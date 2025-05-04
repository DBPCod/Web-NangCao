function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

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
        let html = '';
        brands.forEach(brand => {
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

function updatePriceRange() {
    fetch('/smartstation/src/mvc/controllers/SanPhamController.php?priceRange=true', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi tải khoảng giá');
        }
        return response.json();
    })
    .then(data => {
        const minPrice = data.minPrice || 400000;
        const maxPrice = data.maxPrice || 48500000;
        initRangeSlider(minPrice, maxPrice);
    })
    .catch(error => {
        console.error('Lỗi tải khoảng giá:', error);
    });
}

function initRangeSlider(minPrice, maxPrice) {
    const slider = document.querySelector('.range-slider');
    if (!slider) return;

    const minDisplay = document.querySelector('.min-price-display');
    const maxDisplay = document.querySelector('.max-price-display');
    const thumbs = document.querySelectorAll('.range-slider__thumb');
    const progress = document.querySelector('.range-slider__progress');

    let minVal = minPrice;
    let maxVal = maxPrice;

    minDisplay.textContent = formatPrice(minVal);
    maxDisplay.textContent = formatPrice(maxVal);

    thumbs[0].style.left = '0%';
    thumbs[1].style.left = '100%';
    progress.style.left = '0%';
    progress.style.width = '100%';

    let activeThumb = null;

    thumbs.forEach((thumb, index) => {
        // Xử lý sự kiện chuột
        thumb.addEventListener('mousedown', startDrag);
        // Xử lý sự kiện cảm ứng
        thumb.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            e.preventDefault();
            activeThumb = {
                element: thumb,
                index: index,
                startX: e.clientX || e.touches[0].clientX,
                startLeft: parseFloat(thumb.style.left || (index === 0 ? '0' : '100'))
            };

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
    });

    function onDrag(e) {
        if (!activeThumb) return;

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const container = slider.getBoundingClientRect();
        const containerWidth = container.width;

        const deltaX = clientX - activeThumb.startX;
        let newLeft = activeThumb.startLeft + (deltaX / containerWidth * 100);

        newLeft = Math.max(0, Math.min(100, newLeft));

        activeThumb.element.style.left = `${newLeft}%`;

        const leftThumbPos = parseFloat(thumbs[0].style.left || '0');
        const rightThumbPos = parseFloat(thumbs[1].style.left || '100');

        const leftPos = Math.min(leftThumbPos, rightThumbPos);
        const rightPos = Math.max(leftThumbPos, rightThumbPos);

        const leftValue = Math.round(minPrice + (leftPos / 100) * (maxPrice - minPrice));
        const rightValue = Math.round(minPrice + (rightPos / 100) * (maxPrice - minPrice));

        minVal = leftValue;
        maxVal = rightValue;

        progress.style.left = `${leftPos}%`;
        progress.style.width = `${rightPos - leftPos}%`;

        minDisplay.textContent = formatPrice(minVal);
        maxDisplay.textContent = formatPrice(maxVal);
    }

    function stopDrag() {
        activeThumb = null;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function collectFilters() {
    const filters = {
        brands: [],
        priceRanges: [],
        priceMin: null,
        priceMax: null,
        rams: [],
        pins: []
    };

    document.querySelectorAll('.filter-section .form-check-input[data-brand]').forEach(checkbox => {
        if (checkbox.checked) {
            filters.brands.push(checkbox.getAttribute('data-brand'));
        }
    });

    // Thêm kiểm tra null trước khi truy cập thuộc tính checked
    const app1 = document.querySelector('#app1');
    const app2 = document.querySelector('#app2');
    const app3 = document.querySelector('#app3');
    const app4 = document.querySelector('#app4');
    const app5 = document.querySelector('#app5');

    if (app1 && app1.checked) filters.priceRanges.push('0-3000000');
    if (app2 && app2.checked) filters.priceRanges.push('3000000-6000000');
    if ((app3 && app3.checked) || (app4 && app4.checked)) filters.priceRanges.push('6000000-10000000');
    if (app5 && app5.checked) filters.priceRanges.push('10000000-');

    const minDisplay = document.querySelector('.min-price-display');
    const maxDisplay = document.querySelector('.max-price-display');
    if (minDisplay && maxDisplay) {
        filters.priceMin = parseFloat(minDisplay.textContent.replace(/[^\d]/g, ''));
        filters.priceMax = parseFloat(maxDisplay.textContent.replace(/[^\d]/g, ''));
    }

    document.querySelectorAll('.filter-section .form-check-input[id^="ram"]').forEach(checkbox => {
        if (checkbox.checked) {
            const ramValue = checkbox.nextElementSibling.textContent;
            filters.rams.push(ramValue);
        }
    });

    document.querySelectorAll('.filter-section .form-check-input[id^="pin"]').forEach(checkbox => {
        if (checkbox.checked) {
            const pinLabel = checkbox.nextElementSibling.textContent;
            if (pinLabel === 'Dưới 3000mAh') filters.pins.push('0-3000');
            else if (pinLabel === '3000 - 4000mAh') filters.pins.push('3000-4000');
            else if (pinLabel === '4000 - 5000mAh') filters.pins.push('4000-5000');
            else if (pinLabel === '5000mAh trở lên') filters.pins.push('5000-');
        }
    });

    return filters;
}

function buildQueryString(filters, page) {
    const params = new URLSearchParams();
    params.append('page', page);

    if (filters.brands && filters.brands.length > 0) {
        params.append('brands', filters.brands.join(','));
    }
    if (filters.priceRanges && filters.priceRanges.length > 0) {
        params.append('priceRanges', filters.priceRanges.join(','));
    }
    if (filters.priceMin) {
        params.append('priceMin', filters.priceMin);
    }
    if (filters.priceMax) {
        params.append('priceMax', filters.priceMax);
    }
    if (filters.rams && filters.rams.length > 0) {
        params.append('rams', filters.rams.join(','));
    }
    if (filters.pins && filters.pins.length > 0) {
        params.append('pins', filters.pins.join(','));
    }
    if (filters.searchQuery) {
        params.append('q', filters.searchQuery);
    }
    if (filters.sort) {
        params.append('sort', filters.sort);
    }

    return params.toString();
}

function loadProducts(page = 1, filters = null) {
    const queryString = filters ? buildQueryString(filters, page) : `page=${page}`;
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

        attachProductCardListeners();
    })
    .catch(error => {
        console.error('Lỗi tải sản phẩm:', error);
        document.querySelector('.product-grid').innerHTML = '<div class="col text-center">Lỗi tải sản phẩm.</div>';
    });
}

function searchProductsInput(filters) {
    const searchInputs = document.querySelectorAll('.search-bar input');
    let searchQuery = '';

    searchInputs.forEach(input => {
        if (input.value.trim()) {
            searchQuery = input.value.trim();
        }
    });

    if (searchQuery) {
        filters.searchQuery = searchQuery;
    } else {
        delete filters.searchQuery;
    }

    return filters;
}

function loadFilteredProducts(page, filters, limit, type) {
    const queryString = buildQueryString(filters, page) + `&limit=${limit}`;
    const productContainer = document.querySelector('.product-grid');
    if (productContainer) {
        productContainer.innerHTML = '<div class="col text-center">Đang tải...</div>';
    }

    fetch(`/smartstation/src/public/api/SanPhamAPI.php?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Lỗi tải sản phẩm ${type === 'new-products' ? 'mới nhất' : 'bán chạy'}`);
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
            productHTML = `<div class="col text-center">Không có sản phẩm ${type === 'new-products' ? 'mới' : 'bán chạy'} phù hợp.</div>`;
        }

        if (productContainer) {
            productContainer.innerHTML = productHTML;
        } else {
            console.warn('Container .product-grid không tồn tại trong DOM');
        }

        attachProductCardListeners();

        const totalPages = Math.ceil(data.total / data.limit);
        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link page-btn" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        const paginationContainer = document.querySelector('.pagination');
        if (paginationContainer) {
            paginationContainer.innerHTML = paginationHTML;

            paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newPage = parseInt(btn.dataset.page);
                    loadFilteredProducts(newPage, filters, limit, type);
                });
            });
        }
    })
    .catch(error => {
        console.error(`Lỗi tải sản phẩm ${type === 'new-products' ? 'mới nhất' : 'bán chạy'}:`, error);
        if (productContainer) {
            productContainer.innerHTML = `<div class="col text-center">Lỗi tải sản phẩm ${type === 'new-products' ? 'mới' : 'bán chạy'}.</div>`;
        }
    });
}

function filterNewProducts() {
    var filters = collectFilters();
    filters = searchProductsInput(filters);
    filters.sort = 'latest';
    const limit = 10;
    loadFilteredProducts(1, filters, limit, 'new-products');
}

function filterBestSellingProducts() {
    var filters = collectFilters();
    filters = searchProductsInput(filters);
    filters.sort = 'bestselling';
    const limit = 6;
    loadFilteredProducts(1, filters, limit, 'best-selling');
}

document.addEventListener('DOMContentLoaded', () => {
    renderBrands();
    updatePriceRange();
    loadProducts(1);

    document.getElementById('applyFilterBtn').addEventListener('click', () => {
        const filters = collectFilters();
        loadProducts(1, filters);
        const searchInputs = document.querySelectorAll('.search-bar input');
        searchInputs.forEach(input => {
            input.value = '';
        });
    });

    document.querySelector('.pagination').addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.dataset.page);
            const filters = searchProductsInput(collectFilters());
            loadProducts(page, filters);
        }
    });
});

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
                    htmlMauSac += `<span idchsp=${item.IdCHSP} data-quantity="${item.SoLuong}">${item.MauSac}</span>`;
                }
            });
            setUpAfterSelectedRam(product, selectedRam);
            ram = selectedRam;
            const colorContainer = document.getElementById("modalProductMauSac");
            if (colorContainer) {
                colorContainer.innerHTML = htmlMauSac;
            }
            
            const mauSacOptions = colorContainer?.querySelectorAll('span');
            mauSacOptions?.forEach(colorOption => {
                colorOption.addEventListener('click', (e) => {
                    mauSacOptions.forEach(item => item.classList.remove('selected'));
                    colorOption.classList.add('selected');
                    const selectedColor = e.currentTarget.innerText;
                    setUpAfterSelectedColor(product, selectedColor, ram);
                    
                    const quantity = parseInt(e.currentTarget.getAttribute('data-quantity'));
                    const modalProductTrangThai = document.querySelector('#modalProductTrangThai');
                    if (modalProductTrangThai) {
                        modalProductTrangThai.textContent = quantity > 0 ? `Còn hàng (${quantity})` : 'Hết hàng';
                        modalProductTrangThai.style.color = quantity > 0 ? '#28a745' : '#dc3545';
                    }
                });
            });
            
            ramOptions.forEach(item => item.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}
