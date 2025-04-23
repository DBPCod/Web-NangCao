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
        let html = '';
        brands.forEach(brand => {
            const brandId = brand.TenThuongHieu.toLowerCase().replace(/[^a-z0-9]/g, '');
            html += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="${brandId}" data-brand="${brand.TenThuongHieu}" />
                    <label class="form-check-label" for="${brandId}">${brand.TenThuongHieu}</label>
                </div>`;
        });
        const brandList = document.querySelector('.brand-list');
        if (brandList) {
            brandList.innerHTML = html;
        }
    })
    .catch(error => {
        console.error('Lỗi render thương hiệu:', error);
        const brandList = document.querySelector('.brand-list');
        if (brandList) {
            brandList.innerHTML = '<div class="text-danger">Lỗi tải danh sách thương hiệu</div>';
        }
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

    document.querySelectorAll('.filter-section .form-check-input[data-brand]').forEach(checkbox => {
        if (checkbox.checked) {
            filters.brands.push(checkbox.getAttribute('data-brand'));
        }
    });

    if (document.querySelector('#app1')?.checked) filters.priceRanges.push('0-3000000');
    if (document.querySelector('#app2')?.checked) filters.priceRanges.push('3000000-6000000');
    if (document.querySelector('#app3')?.checked || document.querySelector('#app4')?.checked) filters.priceRanges.push('6000000-10000000');
    if (document.querySelector('#app5')?.checked) filters.priceRanges.push('10000000-');

    const priceSlider = document.querySelector('.price-range .form-range');
    if (priceSlider) {
        filters.priceMin = parseInt(priceSlider.value);
        filters.priceMax = parseInt(priceSlider.max);
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

// Hàm tải sản phẩm
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
        console.log(data);
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
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = productHTML;
        }

        const totalPages = Math.ceil(data.total / data.limit);
        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link page-btn" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.innerHTML = paginationHTML;
        }

        attachProductCardListeners();
    })
    .catch(error => {
        console.error('Lỗi tải sản phẩm:', error);
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = '<div class="col text-center">Lỗi tải sản phẩm.</div>';
        }
    });
}

// Hàm gắn sự kiện cho thẻ sản phẩm
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

            const modalProductName = document.querySelector('#modalProductName');
            if (modalProductName) modalProductName.textContent = productName;

            const modalProductSpecs = document.querySelector('#modalProductSpecs');
            if (modalProductSpecs) modalProductSpecs.textContent = `RAM: ${product.ram || 'N/A'} - ROM: ${product.rom || 'N/A'}`;

            const modalProductPrice = document.querySelector('#modalProductPrice');
            if (modalProductPrice) modalProductPrice.innerHTML = priceHTML;

            const modalProductDiscount = document.querySelector('#modalProductDiscount');
            if (modalProductDiscount) modalProductDiscount.textContent = discountText;

            const modalProductPoints = document.querySelector('#modalProductPoints');
            if (modalProductPoints) modalProductPoints.textContent = '';

            const modalProductRom = document.querySelector('#modalProductRom');
            if (modalProductRom) modalProductRom.textContent = product.rom || 'N/A';

            const modalProductManHinh = document.querySelector('#modalProductManHinh');
            if (modalProductManHinh) modalProductManHinh.textContent = product.manHinh || 'N/A';

            const modalProductPin = document.querySelector('#modalProductPin');
            if (modalProductPin) modalProductPin.textContent = product.pin || 'N/A';

            const modalProductCamera = document.querySelector('#modalProductCamera');
            if (modalProductCamera) modalProductCamera.textContent = product.camera || 'N/A';

            const modalProductTrangThai = document.querySelector('#modalProductTrangThai');
            if (modalProductTrangThai) modalProductTrangThai.textContent = product.trangThai === "1" ? 'Còn hàng' : 'Hết hàng';

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
                const thumbnailGallery = document.querySelector('.thumbnail-gallery');
                if (thumbnailGallery) {
                    thumbnailGallery.innerHTML = thumbnailHTML;
                }
                attachThumbnailListeners();
            })
            .catch(error => {
                console.error('Lỗi tải ảnh:', error);
                const thumbnailHTML = `
                    <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                `;
                const thumbnailGallery = document.querySelector('.thumbnail-gallery');
                if (thumbnailGallery) {
                    thumbnailGallery.innerHTML = thumbnailHTML;
                }
                attachThumbnailListeners();
            });
        });
    });
}

// Hàm tải ảnh carousel
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
    if (carousel) {
        carousel.innerHTML = html;
    }
}

// Hàm gắn sự kiện cho ảnh thu nhỏ
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

// Hàm tải cấu hình sản phẩm
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
    })
    .catch(error => {
        console.error('Lỗi tải cấu hình:', error);
    });
}

// Hàm thiết lập dữ liệu cấu hình sản phẩm
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
            const modalProductName = document.querySelector('#modalProductName');
            if (modalProductName) modalProductName.textContent = item.TenDong;

            const modalProductSpecs = document.querySelector('#modalProductSpecs');
            if (modalProductSpecs) modalProductSpecs.textContent = `RAM: ${item.Ram || 'N/A'} - ROM: ${item.Rom || 'N/A'}`;

            const modalProductPrice = document.querySelector('#modalProductPrice');
            if (modalProductPrice) modalProductPrice.innerHTML = priceHTML;

            const modalProductDiscount = document.querySelector('#modalProductDiscount');
            if (modalProductDiscount) modalProductDiscount.textContent = discountText;

            const modalProductPoints = document.querySelector('#modalProductPoints');
            if (modalProductPoints) modalProductPoints.textContent = '';

            const modalProductRom = document.querySelector('#modalProductRom');
            if (modalProductRom) modalProductRom.textContent = item.Rom || 'N/A';

            const modalProductManHinh = document.querySelector('#modalProductManHinh');
            if (modalProductManHinh) modalProductManHinh.textContent = item.ManHinh || 'N/A';

            const modalProductPin = document.querySelector('#modalProductPin');
            if (modalProductPin) modalProductPin.textContent = item.Pin || 'N/A';

            const modalProductCamera = document.querySelector('#modalProductCamera');
            if (modalProductCamera) modalProductCamera.textContent = item.Camera || 'N/A';

            const modalProductTrangThai = document.querySelector('#modalProductTrangThai');
            if (modalProductTrangThai) modalProductTrangThai.textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
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

    const modalProductRam = document.getElementById("modalProductRam");
    if (modalProductRam) modalProductRam.innerHTML = htmlRam;

    const modalProductMauSac = document.getElementById("modalProductMauSac");
    if (modalProductMauSac) modalProductMauSac.innerHTML = htmlMauSac;

    handleSelectConfigItem(product);
}

// Hàm trích xuất số từ chuỗi
function extractNumber(str) {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

// Hàm thiết lập sau khi chọn RAM
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
            const modalProductName = document.querySelector('#modalProductName');
            if (modalProductName) modalProductName.textContent = item.TenDong;

            const modalProductSpecs = document.querySelector('#modalProductSpecs');
            if (modalProductSpecs) modalProductSpecs.textContent = `RAM: ${item.Ram || 'N/A'} - ROM: ${item.Rom || 'N/A'}`;

            const modalProductPrice = document.querySelector('#modalProductPrice');
            if (modalProductPrice) modalProductPrice.innerHTML = priceHTML;

            const modalProductDiscount = document.querySelector('#modalProductDiscount');
            if (modalProductDiscount) modalProductDiscount.textContent = discountText;

            const modalProductPoints = document.querySelector('#modalProductPoints');
            if (modalProductPoints) modalProductPoints.textContent = '';

            const modalProductRom = document.querySelector('#modalProductRom');
            if (modalProductRom) modalProductRom.textContent = item.Rom || 'N/A';

            const modalProductManHinh = document.querySelector('#modalProductManHinh');
            if (modalProductManHinh) modalProductManHinh.textContent = item.ManHinh || 'N/A';

            const modalProductPin = document.querySelector('#modalProductPin');
            if (modalProductPin) modalProductPin.textContent = item.Pin || 'N/A';

            const modalProductCamera = document.querySelector('#modalProductCamera');
            if (modalProductCamera) modalProductCamera.textContent = item.Camera || 'N/A';

            const modalProductTrangThai = document.querySelector('#modalProductTrangThai');
            if (modalProductTrangThai) modalProductTrangThai.textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
        }
    });
}

// Hàm thiết lập sau khi chọn màu sắc
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
            const modalProductName = document.querySelector('#modalProductName');
            if (modalProductName) modalProductName.textContent = item.TenDong;

            const modalProductSpecs = document.querySelector('#modalProductSpecs');
            if (modalProductSpecs) modalProductSpecs.textContent = `RAM: ${item.Ram || 'N/A'} - ROM: ${item.Rom || 'N/A'}`;

            const modalProductPrice = document.querySelector('#modalProductPrice');
            if (modalProductPrice) modalProductPrice.innerHTML = priceHTML;

            const modalProductDiscount = document.querySelector('#modalProductDiscount');
            if (modalProductDiscount) modalProductDiscount.textContent = discountText;

            const modalProductPoints = document.querySelector('#modalProductPoints');
            if (modalProductPoints) modalProductPoints.textContent = '';

            const modalProductRom = document.querySelector('#modalProductRom');
            if (modalProductRom) modalProductRom.textContent = item.Rom || 'N/A';

            const modalProductManHinh = document.querySelector('#modalProductManHinh');
            if (modalProductManHinh) modalProductManHinh.textContent = item.ManHinh || 'N/A';

            const modalProductPin = document.querySelector('#modalProductPin');
            if (modalProductPin) modalProductPin.textContent = item.Pin || 'N/A';

            const modalProductCamera = document.querySelector('#modalProductCamera');
            if (modalProductCamera) modalProductCamera.textContent = item.Camera || 'N/A';

            const modalProductTrangThai = document.querySelector('#modalProductTrangThai');
            if (modalProductTrangThai) modalProductTrangThai.textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
        }
    });
}

// Hàm xử lý chọn cấu hình
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
                });
            });
            ramOptions.forEach(item => item.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', () => {
    renderBrands();
    loadProducts(1);

    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            const filters = collectFilters();
            console.log(filters);
            loadProducts(1, filters);
        });
    }

    const priceSlider = document.querySelector('.price-range .form-range');
    if (priceSlider) {
        priceSlider.addEventListener('input', () => {
            const value = parseInt(priceSlider.value);
            const priceDisplay = document.querySelector('.price-range .d-flex span:first-child');
            if (priceDisplay) {
                priceDisplay.textContent = formatPrice(value);
            }
        });
    }

    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('page-btn')) {
                const page = parseInt(e.target.dataset.page);
                const filters = collectFilters();
                loadProducts(page, filters);
            }
        });
    }
});







