// Số lượng sản phẩm mỗi trang
var PRODUCTS_PER_PAGE = 8;
var currentPage = 1;
var allProducts = []; // Lưu trữ toàn bộ dữ liệu sản phẩm
var isLoadingProducts = false; // Đặt cờ để kiểm tra trạng thái tải sản phẩm
var permissions = [];
// Hàm lấy dữ liệu quyền từ API
async function loadPermissions() {
    try {
        const response = await fetch('/smartstation/src/mvc/controllers/get_permissions.php', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Lỗi khi lấy quyền: ' + response.status);
        permissions = await response.json();
        console.log('Permissions loaded:', permissions);
    } catch (error) {
        console.error('Lỗi khi lấy quyền:', error);
        toast({
            title: "Lỗi",
            message: "Không thể tải dữ liệu quyền!",
            type: "error",
            duration: 3000,
        });
    }
}

// Hàm kiểm tra quyền
function hasPermission(permissionName, action) {
    return permissions.some(permission => 
        permission.TenQuyen === permissionName && permission[action]
    );
}

// Hàm tải danh sách sản phẩm
async function loadProducts() {

    // Chờ lấy quyền 
    await loadPermissions();

    if (isLoadingProducts) return; // Bỏ qua nếu đang tải
    isLoadingProducts = true;
    fetch("/smartstation/src/mvc/controllers/SanPhamController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((products) => {
            allProducts = products; // Lưu dữ liệu vào biến toàn cục
            renderProductsByPage(currentPage); // Render trang đầu tiên
            renderPagination();// Render nút phân trang

            if (!hasPermission('Danh sách sản phẩm', 'them')) {
                document.querySelector('.btn-success[data-bs-target="#addProductModal"]').style.display = 'none';
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            document.getElementById("productTableBody").innerHTML =
                '<tr><td colspan="7">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
        })
        .finally(() => {
            isLoadingProducts = false; // Đặt lại trạng thái
        });
}

// Hàm render danh sách sản phẩm theo trang
function renderProductsByPage(page) {
    const tbody = document.getElementById("productTableBody");
    let rows = '';

    if (!allProducts || allProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Không có sản phẩm nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToDisplay = allProducts.slice(startIndex, endIndex);

    const hasDeletePermission = hasPermission('Danh sách sản phẩm', 'xoa');
    Promise.all(productsToDisplay.map(product =>
        Promise.all([
            fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${product.IdDongSanPham}`).then(res => res.json()),
            fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${product.IdCHSP}`).then(res => res.json())
        ])
        .then(([dongSanPham, cauHinh]) => {
            if (!dongSanPham || !cauHinh) {
                console.warn("Dữ liệu không hợp lệ:", { dongSanPham, cauHinh });
                return null;
            }
            return {
                ...product,
                TenDong: dongSanPham.TenDong || "Không xác định",
                Ram: cauHinh.Ram || "N/A",
                Rom: cauHinh.Rom || "N/A",
                MauSac: cauHinh.MauSac || "N/A"
            };
        })
    ))
    .then(productsWithDetails => {
        // Lọc bỏ các mục null
        const validProducts = productsWithDetails.filter(product => product);
        validProducts.forEach((product) => {
            let actionButtons = '';
            if (hasDeletePermission) {
                actionButtons += `
                <button class="btn btn-danger" onclick="deleteProduct('${product.IdCHSP}', '${product.IdDongSanPham}'); event.stopPropagation();">Xóa</button>`
            }
            rows += `
                <tr onclick="showProductDetail('${product.IdCHSP}', '${product.IdDongSanPham}')" style="cursor: pointer;">
                    <td>${product.TenDong}</td>
                    <td>${product.Ram}</td>
                    <td>${product.Rom}</td>
                    <td>${product.MauSac}</td>
                    <td>${product.Gia.toLocaleString('vi-VN')} VNĐ</td>
                    <td>${product.SoLuong}</td>
                    <td class="text-center">
                       ${actionButtons || 'Không có quyền'}
                    </td>
                </tr>`;
        });
        tbody.innerHTML = rows;
    });
}

// Hàm render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = "";

    // Helper để thêm nút
    const addPage = (text, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.className = `btn mx-1 ${isActive ? 'btn-primary' : 'btn-secondary'}`;
        
        if (isDisabled) {
            btn.disabled = true;
        } else {
            btn.addEventListener("click", () => {
                currentPage = page;
                renderProductsByPage(currentPage);
                renderPagination();
            });
        }
        paginationContainer.appendChild(btn);
    };

    // Nút "Prev" - chỉ giữ lại «
    addPage("«", currentPage - 1, false, currentPage === 1);

    // Luôn hiển thị trang đầu tiên
    addPage("1", 1, currentPage === 1);

    // Dấu ... nếu cần
    if (currentPage > 4) {
        const dots = document.createElement("span");
        dots.innerText = "...";
        dots.className = "mx-1";
        paginationContainer.appendChild(dots);
    }

    // Các trang gần currentPage
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        addPage(i.toString(), i, currentPage === i);
    }

    // Dấu ... nếu cần
    if (currentPage < totalPages - 3) {
        const dots = document.createElement("span");
        dots.innerText = "...";
        dots.className = "mx-1";
        paginationContainer.appendChild(dots);
    }

    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
        addPage(totalPages.toString(), totalPages, currentPage === totalPages);
    }

    // Nút "Next" - chỉ giữ lại »
    addPage("»", currentPage + 1, false, currentPage === totalPages);
}

// Hàm tải danh sách dòng sản phẩm vào modal thêm
function loadDongSanPhamOptions() {
    fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", { method: "GET" })
        .then(response => response.json())
        .then(dongSanPhams => {
            const select = document.getElementById("idDongSanPham");
            select.innerHTML = '<option value="">Chọn dòng sản phẩm</option>';
            dongSanPhams.forEach(dsp => {
                select.innerHTML += `<option value="${dsp.IdDongSanPham}">${dsp.TenDong}</option>`;
            });
        });
}

// Hàm tải danh sách cấu hình sản phẩm vào modal thêm
function loadCauHinhOptions() {
    fetch("/smartstation/src/mvc/controllers/CauHinhSanPhamController.php", { method: "GET" })
        .then(response => response.json())
        .then(cauHinhs => {
            const select = document.getElementById("idCHSP");
            select.innerHTML = '<option value="">Chọn cấu hình</option>';
            cauHinhs.forEach(ch => {
                select.innerHTML += `<option value="${ch.IdCHSP}">${ch.Ram} - ${ch.Rom} - ${ch.MauSac}</option>`;
            });

            select.onchange = function() {
                const selectedId = this.value;
                if (selectedId) {
                    fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${selectedId}`)
                        .then(res => res.json())
                        .then(cauHinh => {
                            document.getElementById("addRam").textContent = cauHinh.Ram;
                            document.getElementById("addRom").textContent = cauHinh.Rom;
                            document.getElementById("addManHinh").textContent = cauHinh.ManHinh;
                            document.getElementById("addPin").textContent = cauHinh.Pin;
                            document.getElementById("addMauSac").textContent = cauHinh.MauSac;
                            document.getElementById("addCamera").textContent = cauHinh.Camera;
                        });
                } else {
                    document.getElementById("addRam").textContent = "";
                    document.getElementById("addRom").textContent = "";
                    document.getElementById("addManHinh").textContent = "";
                    document.getElementById("addPin").textContent = "";
                    document.getElementById("addMauSac").textContent = "";
                    document.getElementById("addCamera").textContent = "";
                }
            };
        });
}

// Hàm hiển thị modal thêm sản phẩm
function showAddProductModal() {
    document.getElementById("addProductForm").reset();
    document.getElementById("soLuong").value = 0;
    document.getElementById("addProductImages").value = "";
    document.getElementById("addRam").textContent = "";
    document.getElementById("addRom").textContent = "";
    document.getElementById("addManHinh").textContent = "";
    document.getElementById("addPin").textContent = "";
    document.getElementById("addMauSac").textContent = "";
    document.getElementById("addCamera").textContent = "";
    loadDongSanPhamOptions();
    loadCauHinhOptions();
}

// Hàm đọc file ảnh và chuyển thành base64
function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Hàm thêm sản phẩm và ảnh
async function submitAddProduct() {
    const idDongSanPham = document.getElementById("idDongSanPham").value;
    const idCHSP = document.getElementById("idCHSP").value;
    const soLuong = document.getElementById("soLuong").value;
    const imageFiles = document.getElementById("addProductImages").files;

    if (!idDongSanPham || !idCHSP) {
        toast({
            title: "Cảnh báo",
            message: "Vui lòng chọn dòng sản phẩm và cấu hình!",
            type: "warning",
            duration: 3000,
        });
        return;
    }

    // Dữ liệu sản phẩm
    const productData = {
        IdDongSanPham: idDongSanPham,
        IdCHSP: idCHSP,
        SoLuong: parseInt(soLuong),
        Gia: 0,
        TrangThai: 1
    };

    try {
        // Thêm sản phẩm
        const productResponse = await fetch("/smartstation/src/mvc/controllers/SanPhamController.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });

        if (!productResponse.ok) {
            const errorData = await productResponse.json();
            if (errorData.message === "Sản phẩm đã tồn tại và đang hoạt động.") {
                toast({
                    title: "Cảnh báo",
                    message: "Sản phẩm này đã tồn tại và đang hoạt động!",
                    type: "warning",
                    duration: 3000,
                });
                return;
            }
            throw new Error(errorData.message || "Thêm sản phẩm thất bại");
        }

        const productResult = await productResponse.json();

        // Nếu có ảnh, upload từng ảnh
        if (imageFiles.length > 0) {
            const uploadPromises = Array.from(imageFiles).map(async (file) => {
                const base64Image = await readImageFile(file);
                const imageData = {
                    Anh: base64Image,
                    IdCHSP: idCHSP,
                    IdDongSanPham: idDongSanPham,
                    TrangThai: 1
                };
                return fetch("/smartstation/src/mvc/controllers/AnhController.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(imageData),
                });
            });

            await Promise.all(uploadPromises);
            toast({
                title: "Thành công",
                message: "Thêm hoặc kích hoạt sản phẩm và ảnh thành công",
                type: "success",
                duration: 3000,
            });
        } else {
            toast({
                title: "Thành công",
                message: "Thêm hoặc kích hoạt sản phẩm thành công",
                type: "success",
                duration: 3000,
            });
        }

        bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
        loadProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
        console.error("Error:", error);
        toast({
            title: "Lỗi",
            message: error.message || "Thêm sản phẩm hoặc ảnh thất bại",
            type: "error",
            duration: 3000,
        });
    }
}

// Hàm hiển thị chi tiết sản phẩm
function showProductDetail(idCHSP, idDSP) {
    Promise.all([
        fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`).then(res => res.json()),
        fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`).then(res => res.json()),
        fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`).then(res => res.json()),
        fetch(`/smartstation/src/mvc/controllers/AnhController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`).then(res => res.json())
    ])
    .then(([sanPham, dongSanPham, cauHinh, anhList]) => {
        return fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${dongSanPham.IdThuongHieu}`)
            .then(res => res.json())
            .then(thuongHieu => {
                const thuongHieuData = thuongHieu && thuongHieu.IdThuongHieu ? thuongHieu : { TenThuongHieu: "Không xác định" };
                return [sanPham, dongSanPham, cauHinh, thuongHieuData, anhList];
            });
    })
    .then(([sanPham, dongSanPham, cauHinh, thuongHieu, anhList]) => {
        document.getElementById("detailTenDong").textContent = dongSanPham.TenDong;
        document.getElementById("detailSoLuong").textContent = sanPham.SoLuong;
        document.getElementById("detailGia").textContent = sanPham.Gia.toLocaleString('vi-VN') + " VNĐ";
        document.getElementById("detailThuongHieu").textContent = thuongHieu.TenThuongHieu;
        document.getElementById("detailRam").textContent = cauHinh.Ram;
        document.getElementById("detailRom").textContent = cauHinh.Rom;
        document.getElementById("detailManHinh").textContent = cauHinh.ManHinh;
        document.getElementById("detailPin").textContent = cauHinh.Pin;
        document.getElementById("detailMauSac").textContent = cauHinh.MauSac;
        document.getElementById("detailCamera").textContent = cauHinh.Camera;

        const imagesDiv = document.getElementById("productImages");
        imagesDiv.innerHTML = "";
        if (anhList.length > 0) {
            anhList.forEach((anh, index) => {
                const isActive = index === 0 ? "active" : "";
                const imgSrc = `data:image/jpeg;base64,${anh.Anh}`;
                imagesDiv.innerHTML += `
                    <div class="carousel-item ${isActive}">
                        <img src="${imgSrc}" class="d-block w-100" alt="Ảnh sản phẩm" style="max-height: 300px; object-fit: contain;">
                    </div>`;
            });
        } else {
            imagesDiv.innerHTML = `
                <div class="carousel-item active">
                    <div class="text-center p-3">Không có ảnh</div>
                </div>`;
        }

        new bootstrap.Modal(document.getElementById("productDetailModal")).show();
    })
    .catch(error => {
        console.error("Error:", error);
        toast({
            title: "Cảnh báo",
            message: "Không thể tải chi tiết sản phẩm",
            type: "warning",
            duration: 3000,
        });
    });
}

// Hàm xóa sản phẩm
function deleteProduct(idCHSP, idDSP) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(product => {
                if (product.SoLuong === 0) {
                    if (product.TrangThai == 1) {
                        return fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
                            method: "DELETE",
                        });
                    } else {
                        throw new Error("Sản phẩm không còn hoạt động. Xóa thất bại.");
                    }
                } else {
                    throw new Error("Chỉ được xóa sản phẩm khi số lượng = 0");
                }
            })
            .then(response => response.json())
            .then(data => {
                toast({
                    title: "Thành công",
                    message: data.message,
                    type: "success",
                    duration: 3000,
                });
                loadProducts(); // Tải lại danh sách sản phẩm
            })
            .catch(error => {
                console.error("Error:", error);
                toast({
                    title: error.message.includes("số lượng") ? "Cảnh báo" : "Lỗi",
                    message: error.message,
                    type: error.message.includes("số lượng") ? "warning" : "error",
                    duration: 3000,
                });
            });
    }
}

// Gắn sự kiện cho nút "Thêm sản phẩm"
document.querySelector('[data-bs-target="#addProductModal"]').addEventListener("click", showAddProductModal);

// Gọi khi script được tải
loadProducts();
