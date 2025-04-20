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
            const products = data.products;
            let productHTML = '';
            
            if (products && products.length > 0) {
                products.forEach(product => {
                    const productName = product.name || 'Sản phẩm không xác định';
                    const giaGocNum = Number(product.giaGoc);
                    const giaGoc = !isNaN(giaGocNum) && product.giaGoc !== null ? `${giaGocNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
                    let priceHTML = '';
                    if (product.giaGiam !== null && product.giaGiam !== undefined) {
                        const giaGiamNum = Number(product.giaGiam);
                        const giaGiam = !isNaN(giaGiamNum) ? `${giaGiamNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
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

    function attachProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const product = JSON.parse(card.dataset.product);
                const productName = product.name || 'Sản phẩm không xác định';
                const giaGocNum = Number(product.giaGoc);
                const giaGoc = !isNaN(giaGocNum) && product.giaGoc !== null ? `${giaGocNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
                let priceHTML = '';
                let discountText = '';
                if (product.giaGiam !== null && product.giaGiam !== undefined) {
                    const giaGiamNum = Number(product.giaGiam);
                    const giaGiam = !isNaN(giaGiamNum) ? `${giaGiamNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
                    priceHTML = `<span class="text-decoration-line-through text-muted me-2">${giaGoc}</span> ${giaGiam}`;
                    discountText = product.phanTramGiam ? `Giảm ${product.phanTramGiam}%` : '';
                } else {
                    priceHTML = giaGoc;
                }
                loadConfigItem(product.idDSP,product.idCHSP);
                const imageSrc = product.image ? `data:image/jpeg;base64,${product.image}` : '/smartstation/src/public/img/default.png';
                // document.querySelector('#modalProductImage').src = imageSrc;
                // document.querySelector('#modalProductImage').alt = productName;
                document.querySelector('#modalProductName').textContent = productName;
                document.querySelector('#modalProductSpecs').textContent = `RAM: ${product.ram || 'N/A'} - ROM: ${product.rom || 'N/A'}`;
                document.querySelector('#modalProductPrice').innerHTML = priceHTML;
                document.querySelector('#modalProductDiscount').textContent = discountText;
                document.querySelector('#modalProductPoints').textContent = '';
                
                // Điền thông số kỹ thuật
                // document.querySelector('#modalProductRam').textContent = product.ram || 'N/A';
                document.querySelector('#modalProductRom').textContent = product.rom || 'N/A';
                document.querySelector('#modalProductManHinh').textContent = product.manHinh || 'N/A';
                document.querySelector('#modalProductPin').textContent = product.pin || 'N/A';
                // document.querySelector('#modalProductMauSac').textContent = product.mauSac || 'N/A';
                document.querySelector('#modalProductCamera').textContent = product.camera || 'N/A';
                document.querySelector('#modalProductTrangThai').textContent = product.trangThai === "1" ? 'Còn hàng' : 'Hết hàng';
               
                // Gọi API để lấy tất cả ảnh của dòng sản phẩm
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
                    loadCarouselImages(images,product)
                   
                    let thumbnailHTML = '';
                    if (images && images.length > 0) {
                        images.forEach((image, index) => {
                            const imageSrc = image.Anh ? `data:image/jpeg;base64,${image.Anh}` : '/smartstation/src/public/img/default.png';
                            thumbnailHTML += `
                                <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                            `;
                        });
                    } else {
                        // Nếu không có ảnh, hiển thị ảnh mặc định
                        thumbnailHTML = `
                            <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                        `;
                    }
                    document.querySelector('.thumbnail-gallery').innerHTML = thumbnailHTML;

                    // Gắn sự kiện cho ảnh thu nhỏ
                    attachThumbnailListeners();
                })
                .catch(error => {
                    console.error('Lỗi tải ảnh:', error);
                    // Hiển thị ảnh mặc định nếu lỗi
                    const thumbnailHTML = `
                        <img src="${imageSrc}" alt="${productName} thumbnail" class="thumbnail-image active" data-index="0">
                    `;
                    document.querySelector('.thumbnail-gallery').innerHTML = thumbnailHTML;
                    attachThumbnailListeners();
                });
            });
        });
    }

    function loadCarouselImages(data,product)
    {
        
        var carousel = document.querySelectorAll(".carousel-inner");
        //có một carousel khác bị trùng class
        html='';
        data.forEach((item) => {
            if(item.IdDongSanPham == product.idDSP && item.IdCHSP == product.idCHSP)
            {
                html+=`<div class="carousel-item active">
                            <img class="d-block w-100" src="data:image/jpeg;base64,${item.Anh}" alt="First slide">
                        </div>`;
            }else
            {
                html+=`<div class="carousel-item">
                            <img class="d-block w-100" src="data:image/jpeg;base64,${item.Anh}" alt="Second slide">
                        </div>`;
            }
        });
        carousel[1].innerHTML=html;

    }
    function attachThumbnailListeners() {
        var listImg = document.querySelectorAll("#carouselExampleControls .carousel-inner .carousel-item");
    
        document.querySelectorAll('.thumbnail-image').forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Xóa class 'active' khỏi tất cả carousel-item
                listImg.forEach(item => {
                    item.classList.remove("active");
                });
    
                // Lấy index từ thumbnail hiện tại
                const index = thumbnail.dataset.index;
    
                // Thêm class 'active' cho carousel-item tương ứng
                if (listImg[index]) {
                    listImg[index].classList.add("active");
                }
    
                // Cập nhật trạng thái active cho thumbnail
                document.querySelectorAll('.thumbnail-image').forEach(img => img.classList.remove('active'));
                thumbnail.classList.add('active');
            });
        });
    }
    
    

    // Tải trang đầu tiên
    loadProducts(1);
    handleSelectConfigItem();
    // Xử lý click vào số trang
    document.querySelector('.pagination').addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.dataset.page);
            loadProducts(page);
        }
    });


    function loadConfigItem(idDSP,idCHSP)
    {
        fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idDSP=${idDSP}`, {
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
        .then(configs => {
            setUpDataConfigItem(configs,idDSP,idCHSP);
        });
    }


    function setUpDataConfigItem(product,idDSP,idCHSP)
    {
        product.forEach((item)=>{
            if(item.IdCHSP == idCHSP && item.IdDongSanPham == idDSP)
            {
                
                const giaGocNum = Number(item.Gia);
                const giaGoc = !isNaN(giaGocNum) && item.Gia !== null ? `${giaGocNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
                let priceHTML = '';
                let discountText = '';
                if (item.GiaGiam !== null && item.GiaGiam !== undefined) {
                    const giaGiamNum = Number(item.GiaGiam);
                    const giaGiam = !isNaN(giaGiamNum) ? `${giaGiamNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
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
                        
                        // Điền thông số kỹ thuật
                        // document.querySelector('#modalProductRam').textContent = product.ram || 'N/A';
                document.querySelector('#modalProductRom').textContent = item.Rom || 'N/A';
                document.querySelector('#modalProductManHinh').textContent = item.ManHinh || 'N/A';
                document.querySelector('#modalProductPin').textContent = item.Pin || 'N/A';
                        // document.querySelector('#modalProductMauSac').textContent = product.mauSac || 'N/A';
                document.querySelector('#modalProductCamera').textContent = item.Camera || 'N/A';
                document.querySelector('#modalProductTrangThai').textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
            }
        })
        


        
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
        
        // Sắp xếp ramList theo dung lượng RAM
        ramList.sort((a, b) => extractNumber(a.Ram) - extractNumber(b.Ram));
        
        let htmlRam = '', htmlMauSac = '';
        
        // Render HTML cho RAM (có cả IdDongSanPham)
        ramList.forEach(item => {
            htmlRam += `<span idDSP="${item.IdDongSanPham}">${item.Ram}</span>`;
        });
        
        // Render HTML cho màu sắc
        colorList.forEach(color => {
            htmlMauSac += `<span>${color}</span>`;
        });
        
        document.getElementById("modalProductRam").innerHTML = htmlRam;
        document.getElementById("modalProductMauSac").innerHTML = htmlMauSac;
        

            handleSelectConfigItem(product);

        // Gán sự kiện
        // handleSelectConfigItem(product);
    }

    function extractNumber(str) {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }


    function setUpAfterSelectedRam(product,selectedRam)
    {
        product.forEach((item)=>{
            if(item.Ram == selectedRam)
            {
                const giaGocNum = Number(item.Gia);
                const giaGoc = !isNaN(giaGocNum) && item.Gia !== null ? `${giaGocNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
                let priceHTML = '';
                let discountText = '';
                if (item.GiaGiam !== null && item.GiaGiam !== undefined) {
                    const giaGiamNum = Number(item.GiaGiam);
                    const giaGiam = !isNaN(giaGiamNum) ? `${giaGiamNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
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
                        
                        // Điền thông số kỹ thuật
                        // document.querySelector('#modalProductRam').textContent = product.ram || 'N/A';
                document.querySelector('#modalProductRom').textContent = item.Rom || 'N/A';
                document.querySelector('#modalProductManHinh').textContent = item.ManHinh || 'N/A';
                document.querySelector('#modalProductPin').textContent = item.Pin || 'N/A';
                        // document.querySelector('#modalProductMauSac').textContent = product.mauSac || 'N/A';
                document.querySelector('#modalProductCamera').textContent = item.Camera || 'N/A';
                document.querySelector('#modalProductTrangThai').textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
            }
        });
    }


    function setUpAfterSelectedColor(product,selectedColor,ram)
    {
        product.forEach((item)=>{
            if(item.Ram == ram && item.MauSac == selectedColor)
            {
                const giaGocNum = Number(item.Gia);
                const giaGoc = !isNaN(giaGocNum) && item.Gia !== null ? `${giaGocNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
                let priceHTML = '';
                let discountText = '';
                console.log("A");
                if (item.GiaGiam !== null && item.GiaGiam !== undefined) {
                    const giaGiamNum = Number(item.GiaGiam);
                    const giaGiam = !isNaN(giaGiamNum) ? `${giaGiamNum.toLocaleString('vi-VN')} VNĐ` : 'N/A';
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
                        
                        // Điền thông số kỹ thuật
                        // document.querySelector('#modalProductRam').textContent = product.ram || 'N/A';
                document.querySelector('#modalProductRom').textContent = item.Rom || 'N/A';
                document.querySelector('#modalProductManHinh').textContent = item.ManHinh || 'N/A';
                document.querySelector('#modalProductPin').textContent = item.Pin || 'N/A';
                        // document.querySelector('#modalProductMauSac').textContent = product.mauSac || 'N/A';
                document.querySelector('#modalProductCamera').textContent = item.Camera || 'N/A';
                document.querySelector('#modalProductTrangThai').textContent = item.SoLuong !== 0 ? 'Còn hàng' : 'Hết hàng';
            }
        });
    }

    function handleSelectConfigItem(product) {

        var ram;
        const ramOptions = document.querySelectorAll('#modalProductRam span');
        ramOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Lấy RAM được chọn
                const selectedRam = e.currentTarget.innerText;
    
                // Tạo danh sách màu sắc phù hợp
                let htmlMauSac = '';
                product.forEach((item) => {
                    if (item.Ram === selectedRam) {
                        htmlMauSac += `<span idchsp=${item.IdCHSP}>${item.MauSac}</span>`;
                    }
                });
                setUpAfterSelectedRam(product,selectedRam);
                ram=selectedRam;
                // Render lại màu sắc
                const colorContainer = document.getElementById("modalProductMauSac");
                colorContainer.innerHTML = htmlMauSac;
    
                // Gán sự kiện cho màu sắc mới render
                const mauSacOptions = colorContainer.querySelectorAll('span');
                mauSacOptions.forEach(colorOption => {
                    colorOption.addEventListener('click', (e) => {
                        mauSacOptions.forEach(item => item.classList.remove('selected'));
                        colorOption.classList.add('selected');
                        const selectedColor = e.currentTarget.innerText;
                        setUpAfterSelectedColor(product,selectedColor,ram)
                    });

                });
    
                // Cập nhật selected cho RAM
                ramOptions.forEach(item => item.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }
    


});