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
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const products = data.products;
            let productHTML = '';
            
            if (products && products.length > 0) {
                products.forEach(product => {
                    productHTML += `
                        <div class="col">
                            <div class="product-card" data-bs-toggle="modal" data-bs-target="#productModal" data-product='${JSON.stringify(product)}'>
                                <img src="${product.image}" alt="${product.name}">
                                <div class="product-name">${product.name}</div>
                                <div class="product-specs">RAM: ${product.ram} - ROM: ${product.rom}</div>
                                <div class="product-price">${product.gia}</div>
                            </div>
                        </div>`;
                });
            }
            
            document.querySelector('.product-grid').innerHTML = productHTML;
            
            // Cập nhật pagination
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
            
            // Gắn lại event listeners cho các product card mới
            attachProductCardListeners();
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
    }

    function attachProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const product = JSON.parse(card.dataset.product);
                
                document.querySelector('#modalProductImage').src = product.image;
                document.querySelector('#modalProductImage').alt = product.name;
                document.querySelector('#modalProductName').textContent = product.name;
                document.querySelector('#modalProductSpecs').textContent = `RAM: ${product.ram} - ROM: ${product.rom}`;
                document.querySelector('#modalProductPrice').innerHTML = product.gia;
                document.querySelector('#modalProductDiscount').textContent = '';
                document.querySelector('#modalProductPoints').textContent = '';
                
                // Điền thông số kỹ thuật
                document.querySelector('#modalProductRam').textContent = product.ram || 'N/A';
                document.querySelector('#modalProductRom').textContent = product.rom || 'N/A';
                document.querySelector('#modalProductManHinh').textContent = product.manHinh || 'N/A';
                document.querySelector('#modalProductPin').textContent = product.pin || 'N/A';
                document.querySelector('#modalProductMauSac').textContent = product.mauSac || 'N/A';
                document.querySelector('#modalProductCamera').textContent = product.camera || 'N/A';
                document.querySelector('#modalProductTrangThai').textContent = product.trangThai ? 'Còn hàng' : 'Hết hàng';

                // Xử lý thumbnail gallery
                const thumbnailHTML = `
                    <img src="${product.image}" alt="${product.name} thumbnail" class="thumbnail-image active" data-index="0">
                `;
                document.querySelector('.thumbnail-gallery').innerHTML = thumbnailHTML;

                // Gắn lại event listeners cho thumbnails
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

    // Load trang đầu tiên
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

    // Gắn event listeners ban đầu
    attachProductCardListeners();
});
