document.addEventListener('DOMContentLoaded', () => {
    function loadProducts(page) {
        fetch(`/smartstation/src/public/api/SanPhamAPI.php?page=${page}`, {
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
                    const giaGoc = product.giaGoc ? `${product.giaGoc.toLocaleString()} VNĐ` : 'N/A';
                    const giaHienThi = product.giaGiam ? `${product.giaGiam.toLocaleString()} VNĐ` : giaGoc;
                    const giaGocHTML = product.giaGiam ? `<span class="text-decoration-line-through text-muted">${giaGoc}</span>` : '';
                    productHTML += `
                        <div class="col">
                            <div class="product-card" data-bs-toggle="modal" data-bs-target="#productModal" data-product='${JSON.stringify(product)}'>
                                <img src="${product.image}" alt="${productName}">
                                <div class="product-name">${productName}</div>
                                <div class="product-specs">RAM: ${product.ram} - ROM: ${product.rom}</div>
                                <div class="product-price">${giaHienThi} ${giaGocHTML}</div>
                            </div>
                        </div>`;
                });
            } else {
                productHTML = '<div class="col">Không có sản phẩm nào.</div>';
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
            
            // Gắn lại sự kiện cho các thẻ sản phẩm mới
            attachProductCardListeners();
        })
        .catch(error => {
            console.error('Lỗi tải sản phẩm:', error);
            document.querySelector('.product-grid').innerHTML = '<div class="col">Lỗi tải sản phẩm.</div>';
        });
    }

    function attachProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const product = JSON.parse(card.dataset.product);
                const productName = product.name || 'Sản phẩm không xác định';
                const giaGoc = product.giaGoc ? `${product.giaGoc.toLocaleString()} VNĐ` : 'N/A';
                const giaGiam = product.giaGiam ? `${product.giaGiam.toLocaleString()} VNĐ` : null;
                const giaHienThi = giaGiam || giaGoc;
                const giaGocHTML = product.giaGiam ? `<span class="text-decoration-line-through text-muted">${giaGoc}</span>` : '';
                const khuyenMaiHTML = product.phanTramGiam ? `Giảm ${product.phanTramGiam}%` : '';
                
                document.querySelector('#modalProductImage').src = product.image;
                document.querySelector('#modalProductImage').alt = productName;
                document.querySelector('#modalProductName').textContent = productName;
                document.querySelector('#modalProductSpecs').textContent = `RAM: ${product.ram} - ROM: ${product.rom}`;
                document.querySelector('#modalProductPrice').innerHTML = `${giaHienThi} ${giaGocHTML}`;
                document.querySelector('#modalProductDiscount').textContent = khuyenMaiHTML;
                document.querySelector('#modalProductPoints').textContent = '';
                
                // Điền thông số kỹ thuật
                document.querySelector('#modalProductRam').textContent = product.ram || 'N/A';
                document.querySelector('#modalProductRom').textContent = product.rom || 'N/A';
                document.querySelector('#modalProductManHinh').textContent = product.manHinh || 'N/A';
                document.querySelector('#modalProductPin').textContent = product.pin || 'N/A';
                document.querySelector('#modalProductMauSac').textContent = product.mauSac || 'N/A';
                document.querySelector('#modalProductCamera').textContent = product.camera || 'N/A';
                document.querySelector('#modalProductTrangThai').textContent = product.trangThai === "1" ? 'Còn hàng' : 'Hết hàng';

                // Xử lý thư viện ảnh thu nhỏ
                const thumbnailHTML = `
                    <img src="${product.image}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                `;
                document.querySelector('.thumbnail-gallery').innerHTML = thumbnailHTML;

                // Gắn lại sự kiện cho ảnh thu nhỏ
                attachThumbnailListeners();
            });
        });
    }

    function attachThumbnailListeners() {
        document.querySelectorAll('.thumbnail-image').forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const imgSrc = thumbnail.src;
                document.querySelector('#modalProductImage').src = imgSrc;
                document.querySelectorAll('.thumbnail-image').forEach(img => img.classList.remove('active'));
                thumbnail.classList.add('active');
            });
        });
    }

    // Tải trang đầu tiên
    loadProducts(1);

    // Xử lý click vào số trang
    document.querySelector('.pagination').addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        if (target.classList.contains('page-btn')) {
            const page = parseInt(target.dataset.page);
            loadProducts(page);
        }
    });

    // Gắn sự kiện ban đầu
    attachProductCardListeners();
});