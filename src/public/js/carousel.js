document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to carousel items
    const carouselItems = document.querySelectorAll('#promoCarousel .carousel-item');
    
    carouselItems.forEach(item => {
        item.addEventListener('click', function() {
            const idCHSP = this.getAttribute('data-idchsp');
            const idDSP = this.getAttribute('data-iddongsanpham');
            if (idCHSP && idDSP) {
                fetchProductDetails(idCHSP, idDSP);
            }
        });
    });
    
    // Function to fetch product details and open modal
    function fetchProductDetails(idCHSP, idDSP) {
        // Fetch product details from the server
        fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi tải thông tin sản phẩm');
            }
            return response.json();
        })
        .then(product => {
            if (!product || !product.TenDong || product.TrangThai === "0") {
                // Hiển thị toast cảnh báo nếu sản phẩm không tồn tại hoặc đã dừng hoạt động
                toast({
                    title: "Cảnh báo",
                    message: "Sản phẩm đã dừng hoạt động hoặc không tồn tại",
                    type: "warning",
                    duration: 3000,
                });
                return;
            }
            
            // Format product data for the modal
            const productName = product.TenDong || 'Sản phẩm không xác định';
            const giaGocNum = Number(product.Gia);
            const giaGoc = !isNaN(giaGocNum) && product.Gia !== null ? formatPrice(giaGocNum) : 'N/A';
            let priceHTML = '';
            let discountText = '';
            
            if (product.GiaGiam !== null && product.GiaGiam !== undefined) {
                const giaGiamNum = Number(product.GiaGiam);
                const giaGiam = !isNaN(giaGiamNum) ? formatPrice(giaGiamNum) : 'N/A';
                priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                discountText = product.PhanTramGiam ? `Giảm ${product.PhanTramGiam}%` : '';
            } else {
                priceHTML = giaGoc;
            }
            
            // Load configuration items for the product
            loadConfigItem(idDSP, idCHSP);
            
            const imageSrc = product.Anh ? `data:image/jpeg;base64,${product.Anh}` : '/smartstation/src/public/img/default.png';

            const modalProductName = document.querySelector('#modalProductName');
            if (modalProductName) modalProductName.textContent = productName;

            const modalProductSpecs = document.querySelector('#modalProductSpecs');
            if (modalProductSpecs) modalProductSpecs.textContent = `RAM: ${product.Ram || 'N/A'} - ROM: ${product.Rom || 'N/A'}`;

            const modalProductPrice = document.querySelector('#modalProductPrice');
            if (modalProductPrice) modalProductPrice.innerHTML = priceHTML;
            
            const modalProductDiscount = document.querySelector('#modalProductDiscount');
            if (modalProductDiscount) modalProductDiscount.textContent = discountText;
            
            const modalProductPoints = document.querySelector('#modalProductPoints');
            if (modalProductPoints) modalProductPoints.textContent = '';
            
            const modalProductRom = document.querySelector('#modalProductRom');
            if (modalProductRom) modalProductRom.textContent = product.Rom || 'N/A';
            
            const modalProductManHinh = document.querySelector('#modalProductManHinh');
            if (modalProductManHinh) modalProductManHinh.textContent = product.ManHinh || 'N/A';
            
            const modalProductPin = document.querySelector('#modalProductPin');
            if (modalProductPin) modalProductPin.textContent = product.Pin || 'N/A';

            const modalProductCamera = document.querySelector('#modalProductCamera');
            if (modalProductCamera) modalProductCamera.textContent = product.Camera || 'N/A';

            const modalProductTrangThai = document.querySelector('#modalProductTrangThai');
            if (modalProductTrangThai) modalProductTrangThai.textContent = product.TrangThai === "1" ? 'Còn hàng' : 'Hết hàng';

            fetch(`/smartstation/src/mvc/controllers/AnhController.php?idDSP=${idDSP}`, {
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
                // Set default image if there's an error
                const defaultSrc = '/smartstation/src/public/img/default.png';
                const carousel = document.querySelectorAll(".carousel-inner")[1];
                if (carousel) {
                    carousel.innerHTML = `
                        <div class="carousel-item active">
                            <img class="d-block w-100" src="${defaultSrc}" alt="Default image">
                        </div>
                    `;
                }
                
                const thumbnailGallery = document.querySelector('.thumbnail-gallery');
                if (thumbnailGallery) {
                    thumbnailGallery.innerHTML = `
                        <img src="${defaultSrc}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                    `;
                }
            });
            
            // Open the modal
            const productModal = new bootstrap.Modal(document.getElementById('productModal'));
            productModal.show();
        })
        .catch(error => {
            console.error('Lỗi:', error);
            // Hiển thị toast cảnh báo khi có lỗi
            toast({
                title: "Cảnh báo",
                message: "Không thể tải thông tin sản phẩm. Sản phẩm có thể đã dừng hoạt động.",
                type: "warning",
                duration: 3000,
            });
        });
    }
    
    // Function to load images into carousel
    function loadCarouselImages(images, product) {
        const carousel = document.querySelector("#carouselExampleControls .carousel-inner");
        if (!carousel) {
            console.error('Không tìm thấy carousel');
            return;
        }
        
        let html = '';
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                const isActive = index === 0 ? 'active' : '';
                const imageSrc = image.Anh ? `data:image/jpeg;base64,${image.Anh}` : '/smartstation/src/public/img/default.png';
                html += `
                    <div class="carousel-item ${isActive}">
                        <img class="d-block w-100" src="${imageSrc}" alt="Slide ${index + 1}">
                    </div>
                `;
            });
        } else {
            // Default image if no images found
            const defaultSrc = '/smartstation/src/public/img/default.png';
            html = `
                <div class="carousel-item active">
                    <img class="d-block w-100" src="${defaultSrc}" alt="Default image">
                </div>
            `;
        }
        
        carousel.innerHTML = html;
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
    
    // Helper function to format price
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }
});



