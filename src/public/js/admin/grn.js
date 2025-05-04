var GRNS_PER_PAGE = 8; // Số lượng phiếu nhập mỗi trang
var currentPage = 1; // Trang hiện tại
var allGRNs = []; // Lưu trữ toàn bộ dữ liệu phiếu nhập

// Hàm tạo mã IMEI theo chuẩn Luhn
function generateIMEI() {
    let imeiBase = [];

    // Tạo 14 số đầu ngẫu nhiên
    for (let i = 0; i < 14; i++) {
        imeiBase.push(Math.floor(Math.random() * 10));
    }

    // Tính số kiểm tra bằng thuật toán Luhn
    function luhnChecksum(digits) {
        let sum = 0;
        for (let i = 0; i < 14; i++) {
            let digit = digits[i];
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        return (10 - (sum % 10)) % 10;
    }

    let checkDigit = luhnChecksum(imeiBase);
    imeiBase.push(checkDigit);

    return imeiBase.join('');
}

// Hàm kiểm tra và tạo IMEI không trùng
async function getUniqueIMEI() {
    let imei;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
        imei = generateIMEI();
        try {
            const response = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?imei=${imei}`);
            const data = await response.json();
            if (!data) {
                isUnique = true;
            }
        } catch (error) {
            console.error("Error checking IMEI:", error);
            attempts++;
        }
    }

    if (!isUnique) {
        throw new Error("Không thể tạo mã IMEI duy nhất sau nhiều lần thử.");
    }
    return imei;
}

// Hàm tải danh sách phiếu nhập
function loadGRNs() {
    fetch("/smartstation/src/mvc/controllers/PhieuNhapController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((phieuNhaps) => {
            allGRNs = phieuNhaps; // Lưu dữ liệu vào biến toàn cục
            renderGRNsByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            document.getElementById("grnTableBody").innerHTML =
                '<tr><td colspan="4">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách phiếu nhập",
                type: "error",
                duration: 3000,
            });
        });
}

// Render danh sách phiếu nhập theo trang
function renderGRNsByPage(page) {
    const tbody = document.getElementById("grnTableBody");
    tbody.innerHTML = "";

    if (!allGRNs || allGRNs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Không có phiếu nhập nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * GRNS_PER_PAGE;
    const endIndex = startIndex + GRNS_PER_PAGE;
    const phieuNhapsToDisplay = allGRNs.slice(startIndex, endIndex);

    Promise.all(phieuNhapsToDisplay.map(phieuNhap => 
        fetch(`/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${phieuNhap.IdNCC}`)
            .then(res => res.json())
            .then(ncc => ({
                ...phieuNhap,
                TenNCC: ncc ? ncc.TenNCC : "Không xác định"
            }))
    ))
    .then(phieuNhapsWithDetails => {
        phieuNhapsWithDetails.forEach((phieuNhap) => {
            tbody.innerHTML += `
                <tr onclick="viewGRN(${phieuNhap.IdPhieuNhap})" style="cursor: pointer;">
                    <td><span class="clickable-id">${phieuNhap.IdPhieuNhap}</span></td>
                    <td>${phieuNhap.TenNCC}</td>
                    <td>${phieuNhap.TongTien ? phieuNhap.TongTien.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa xác định'}</td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteGRN(${phieuNhap.IdPhieuNhap})">Xóa</button>
                    </td>
                </tr>`;
        });
    })
    .catch((error) => {
        console.error("Error fetching NCC details:", error);
        toast({
            title: "Lỗi",
            message: "Không thể tải thông tin nhà cung cấp",
            type: "error",
            duration: 3000,
        });
    });
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allGRNs.length / GRNS_PER_PAGE);
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
                renderGRNsByPage(currentPage);
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

// Hàm xem chi tiết phiếu nhập
function viewGRN(idPhieuNhap) {
    // Lấy thông tin phiếu nhập
    fetch(`/smartstation/src/mvc/controllers/PhieuNhapController.php?idPhieuNhap=${idPhieuNhap}`)
        .then(response => {
            if (!response.ok) throw new Error("Không thể lấy thông tin phiếu nhập");
            return response.json();
        })
        .then(phieuNhap => {
            // Lấy thông tin nhà cung cấp
            fetch(`/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${phieuNhap.IdNCC}`)
                .then(res => {
                    if (!res.ok) throw new Error("Không thể lấy thông tin nhà cung cấp");
                    return res.json();
                })
                .then(ncc => {
                    // Lấy chi tiết phiếu nhập
                    fetch(`/smartstation/src/mvc/controllers/CTPhieuNhapController.php?idPhieuNhap=${idPhieuNhap}`)
                        .then(res => {
                            if (!res.ok) throw new Error("Không thể lấy chi tiết phiếu nhập");
                            return res.json();
                        })
                        .then(ctPhieuNhaps => {
                            console.log(ctPhieuNhaps);
                            // Điền thông tin phiếu nhập vào modal
                            document.getElementById("viewIdPhieuNhap").value = phieuNhap.IdPhieuNhap;
                            document.getElementById("viewTenNCC").value = ncc ? ncc.TenNCC : "Không xác định";
                            document.getElementById("viewNgayNhap").value = phieuNhap.NgayNhap;
                            document.getElementById("viewTongTien").value = phieuNhap.TongTien ? phieuNhap.TongTien.toLocaleString('vi-VN') + ' VNĐ' : "Chưa xác định";
                            document.getElementById("viewTrangThai").value = phieuNhap.TrangThai === 1 ? "Hoạt động" : "Đã xóa";

                            // Điền danh sách sản phẩm từ ctphieunhap
                            const productList = document.getElementById("viewProductList");
                            productList.innerHTML = "";

                            // Chuẩn hóa ctPhieuNhaps thành mảng
                            const ctPhieuNhapsArray = Array.isArray(ctPhieuNhaps) ? ctPhieuNhaps : ctPhieuNhaps && typeof ctPhieuNhaps === 'object' ? [ctPhieuNhaps] : [];

                            if (!ctPhieuNhapsArray.length) {
                                productList.innerHTML = '<tr><td colspan="4">Không có sản phẩm</td></tr>';
                            } else {
                                Promise.all(ctPhieuNhapsArray.map(ct => 
                                    Promise.all([
                                        fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${ct.IdDongSanPham}`)
                                            .then(res => {
                                                if (!res.ok) throw new Error("Không thể lấy dòng sản phẩm");
                                                return res.json();
                                            }),
                                        fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${ct.IdCHSP}`)
                                            .then(res => {
                                                if (!res.ok) throw new Error("Không thể lấy cấu hình sản phẩm");
                                                return res.json();
                                            })
                                    ])
                                    .then(([dongSanPham, cauHinh]) => ({
                                        ...ct,
                                        TenDong: dongSanPham.TenDong || "Không xác định",
                                        Ram: cauHinh.Ram || "N/A",
                                        Rom: cauHinh.Rom || "N/A",
                                        MauSac: cauHinh.MauSac || "N/A",
                                        GiaNhap: parseFloat(ct.GiaNhap) // Chuyển đổi GiaNhap thành số
                                    }))
                                ))
                                .then(ctPhieuNhapsWithDetails => {
                                    ctPhieuNhapsWithDetails.forEach(ct => {
                                        productList.innerHTML += `
                                            <tr>
                                                <td>${ct.TenDong}</td>
                                                <td>${ct.Ram} / ${ct.Rom} / ${ct.MauSac}</td>
                                                <td>${ct.SoLuong}</td>
                                                <td>${ct.GiaNhap.toLocaleString('vi-VN')} VNĐ</td>
                                            </tr>`;
                                    });
                                    // Hiển thị modal
                                    const modal = new bootstrap.Modal(document.getElementById("viewGRNModal"));
                                    modal.show();
                                })
                                .catch(error => {
                                    console.error("Error fetching product details:", error);
                                    productList.innerHTML = '<tr><td colspan="4">Lỗi khi tải sản phẩm</td></tr>';
                                    toast({
                                        title: "Lỗi",
                                        message: "Không thể tải chi tiết sản phẩm",
                                        type: "error",
                                        duration: 3000,
                                    });
                                });
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching ctphieunhap:", error);
                            toast({
                                title: "Lỗi",
                                message: "Không thể tải chi tiết phiếu nhập",
                                type: "error",
                                duration: 3000,
                            });
                        });
                })
                .catch(error => {
                    console.error("Error fetching nhacungcap:", error);
                    toast({
                        title: "Lỗi",
                        message: "Không thể tải thông tin nhà cung cấp",
                        type: "error",
                        duration: 3000,
                    });
                });
        })
        .catch(error => {
            console.error("Error fetching phieunhap:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải thông tin phiếu nhập",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm xóa phiếu nhập
function deleteGRN(idPhieuNhap) {
    if (confirm("Bạn có chắc muốn xóa phiếu nhập này?")) {
        fetch(`/smartstation/src/mvc/controllers/PhieuNhapController.php?idPhieuNhap=${idPhieuNhap}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Lỗi từ server");
                    });
                }
                return response.json();
            })
            .then(data => {
                toast({
                    title: "Thành công",
                    message: data.message,
                    type: "success",
                    duration: 3000,
                });
                loadGRNs();
            })
            .catch(error => {
                console.error("Error:", error);
                toast({
                    title: "Lỗi",
                    message: error.message || "Xóa phiếu nhập thất bại",
                    type: "error",
                    duration: 3000,
                });
            });
    }
}

// Hàm tải danh sách nhà cung cấp vào modal
function loadNhaCungCapOptions() {
    fetch("/smartstation/src/mvc/controllers/NhaCungCapController.php", { method: "GET" })
        .then(response => response.json())
        .then(nhaCungCaps => {
            const select = document.getElementById("idNCC");
            select.innerHTML = '<option value="">Chọn nhà cung cấp</option>';
            nhaCungCaps.forEach(ncc => {
                select.innerHTML += `<option value="${ncc.IdNCC}">${ncc.TenNCC}</option>`;
            });
        })
        .catch(error => {
            console.error("Error loading NCC:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách nhà cung cấp",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm tải danh sách bảo hành cho dropdown
function loadBaoHanhOptions(selectElement) {
    fetch("/smartstation/src/mvc/controllers/BaohanhController.php", { method: "GET" })
        .then(response => response.json())
        .then(warranties => {
            selectElement.innerHTML = '<option value="">Chọn bảo hành</option>';
            warranties.forEach(warranty => {
                selectElement.innerHTML += `<option value="${warranty.IdBaoHanh}">${warranty.ThoiGianBaoHanh} tháng</option>`;
            });
        })
        .catch(error => {
            console.error("Error loading warranties:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách bảo hành",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm tải danh sách sản phẩm cho dropdown
function loadSanPhamOptions(selectElement) {
    fetch("/smartstation/src/mvc/controllers/SanPhamController.php", { method: "GET" })
        .then(response => response.json())
        .then(products => {
            selectElement.innerHTML = '<option value="">Chọn sản phẩm</option>';
            Promise.all(products.map(product => 
                Promise.all([
                    fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${product.IdDongSanPham}`).then(res => res.json()),
                    fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${product.IdCHSP}`).then(res => res.json())
                ])
                .then(([dongSanPham, cauHinh]) => ({
                    ...product,
                    TenDong: dongSanPham.TenDong,
                    Ram: cauHinh.Ram,
                    Rom: cauHinh.Rom,
                    MauSac: cauHinh.MauSac,
                    ManHinh: cauHinh.ManHinh,
                    Pin: cauHinh.Pin,
                    Camera: cauHinh.Camera
                }))
            ))
            .then(productsWithDetails => {
                productsWithDetails.forEach(product => {
                    selectElement.innerHTML += `<option value="${product.IdCHSP},${product.IdDongSanPham}" data-details='${JSON.stringify(product)}'>${product.TenDong} - ${product.Ram} - ${product.Rom} - ${product.MauSac}</option>`;
                });

                selectElement.onchange = function() {
                    const selectedOption = this.options[this.selectedIndex];
                    const productDetails = selectedOption.getAttribute("data-details");
                    const detailsContainer = this.closest(".product-row").querySelector(".product-details");
                    if (productDetails) {
                        const details = JSON.parse(productDetails);
                        detailsContainer.innerHTML = `
                            <p><strong>Dòng:</strong> ${details.TenDong}</p>
                            <p><strong>RAM:</strong> ${details.Ram}</p>
                            <p><strong>ROM:</strong> ${details.Rom}</p>
                            <p><strong>Màu:</strong> ${details.MauSac}</p>
                            <p><strong>Màn hình:</strong> ${details.ManHinh}</p>
                            <p><strong>Pin:</strong> ${details.Pin}</p>
                            <p><strong>Camera:</strong> ${details.Camera}</p>
                        `;
                    } else {
                        detailsContainer.innerHTML = "";
                    }
                };
            });
        })
        .catch(error => {
            console.error("Error loading products:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách sản phẩm",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm tính tổng số lượng
function updateTotalQuantity() {
    const productRows = document.querySelectorAll(".product-row");
    let total = 0;
    productRows.forEach(row => {
        total += parseInt(row.querySelector(".product-quantity").value) || 0;
    });
    document.getElementById("totalQuantity").value = total;
}

// Hàm tính tổng giá nhập
function updateTotalPriceIn() {
    const productRows = document.querySelectorAll(".product-row");
    let total = 0;
    productRows.forEach(row => {
        const quantity = parseInt(row.querySelector(".product-quantity").value) || 0;
        const priceIn = parseInt(row.querySelector(".product-price-in").value) || 0;
        total += quantity * priceIn;
    });
    document.getElementById("totalPriceIn").value = total.toLocaleString('vi-VN') + ' VNĐ';
}

// Hàm thêm dòng sản phẩm mới vào modal
function addProductRow() {
    const productList = document.getElementById("productList");
    const row = document.createElement("div");
    row.className = "product-row";
    row.innerHTML = `
        <div class="row g-3 align-items-end">
            <div class="col-md-4">
                <label class="form-label">Sản phẩm</label>
                <select class="form-control product-select" required></select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Số lượng</label>
                <input type="number" class="form-control product-quantity" min="1" value="1" required>
            </div>
            <div class="col-md-2">
                <label class="form-label">Giá nhập (VNĐ)</label>
                <input type="number" class="form-control product-price-in" min="0" placeholder="Nhập giá nhập" required>
            </div>
            <div class="col-md-2">
                <label class="form-label">Giá bán (VNĐ)</label>
                <input type="number" class="form-control product-price-out" min="0" placeholder="Nhập giá bán" required>
            </div>
            <div class="col-md-2">
                <label class="form-label">Bảo hành</label>
                <select class="form-control warranty-select" required></select>
            </div>
            <div class="col-md-12 product-details mt-2"></div>
        </div>
        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 mt-2 me-2" onclick="this.parentElement.remove(); updateTotalQuantity(); updateTotalPriceIn()">Xóa</button>
    `;
    productList.appendChild(row);
    loadSanPhamOptions(row.querySelector(".product-select"));
    loadBaoHanhOptions(row.querySelector(".warranty-select"));
    row.querySelector(".product-quantity").addEventListener("input", () => {
        updateTotalQuantity();
        updateTotalPriceIn();
    });
    row.querySelector(".product-price-in").addEventListener("input", updateTotalPriceIn);
    updateTotalQuantity();
    updateTotalPriceIn();
}

// Hàm hiển thị modal thêm phiếu nhập
function showAddGRNModal() {
    document.getElementById("addGRNForm").reset();
    document.getElementById("ngayNhap").value = new Date().toISOString().split("T")[0];
    document.getElementById("productList").innerHTML = "";
    document.getElementById("totalQuantity").value = "0";
    document.getElementById("totalPriceIn").value = "0 VNĐ";
    addProductRow();
    loadNhaCungCapOptions();
}

// Hàm lấy cookie theo tên
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Hàm thêm phiếu nhập
async function submitAddGRN() {
    const saveButton = document.querySelector("#addGRNModal .btn-primary");
    const form = document.getElementById("addGRNForm");
    // Hiển thị loading và vô hiệu hóa form
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang lưu...';
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);

    try {
        const idNCC = document.getElementById("idNCC").value;
        const ngayNhap = document.getElementById("ngayNhap").value;
        const productRows = document.querySelectorAll(".product-row");

        if (!idNCC || productRows.length === 0) {
            throw new Error("Vui lòng chọn nhà cung cấp và ít nhất một sản phẩm!");
        }

        const products = [];
        let totalPrice = 0;
        for (const row of productRows) {
            const select = row.querySelector(".product-select");
            const quantity = row.querySelector(".product-quantity").value;
            const priceIn = row.querySelector(".product-price-in").value;
            const priceOut = row.querySelector(".product-price-out").value;
            const warranty = row.querySelector(".warranty-select").value;

            if (!select.value || !quantity || !priceIn || !priceOut || !warranty) {
                throw new Error("Vui lòng điền đầy đủ thông tin sản phẩm, số lượng, giá nhập, giá bán và bảo hành!");
            }
            if (parseInt(quantity) < 1) {
                throw new Error("Số lượng phải lớn hơn 0!");
            }
            if (parseInt(priceIn) < 0 || parseInt(priceOut) < 0) {
                throw new Error("Giá nhập và giá bán không được âm!");
            }
            if (parseInt(priceOut) <= parseInt(priceIn)) {
                throw new Error("Giá bán phải lớn hơn giá nhập!");
            }
            const [idCHSP, idDSP] = select.value.split(",");
            totalPrice += parseInt(quantity) * parseInt(priceIn);
            products.push({
                IdCHSP: parseInt(idCHSP),
                IdDongSanPham: parseInt(idDSP),
                SoLuong: parseInt(quantity),
                GiaNhap: parseInt(priceIn),
                GiaBan: parseInt(priceOut),
                IdBaoHanh: parseInt(warranty)
            });
        }

        const phieuNhapData = {
            IdTaiKhoan: getCookie("admin_idnguoidung"),
            NgayNhap: ngayNhap,
            TongTien: totalPrice,
            TrangThai: 1,
            IdNCC: parseInt(idNCC)
        };

        if (!phieuNhapData.IdTaiKhoan) {
            throw new Error("Không thể xác định tài khoản, vui lòng đăng nhập lại!");
        }

        // Thêm phiếu nhập
        const phieuNhapResponse = await fetch("/smartstation/src/mvc/controllers/PhieuNhapController.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(phieuNhapData),
        });
        if (!phieuNhapResponse.ok) throw new Error("Thêm phiếu nhập thất bại");
        const phieuNhapResult = await phieuNhapResponse.json();
        const idPhieuNhap = phieuNhapResult.phieuNhap.IdPhieuNhap;

        // Thêm chi tiết phiếu nhập và cập nhật sản phẩm/sản phẩm chi tiết
        const promises = products.map(async product => {
            // Thêm chi tiết phiếu nhập
            const ctPhieuNhapData = {
                IdPhieuNhap: idPhieuNhap,
                IdCHSP: product.IdCHSP,
                IdDongSanPham: product.IdDongSanPham,
                SoLuong: product.SoLuong,
                GiaNhap: product.GiaNhap
            };
            const ctPhieuNhapResponse = await fetch("/smartstation/src/mvc/controllers/CTPhieuNhapController.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ctPhieuNhapData),
            });
            if (!ctPhieuNhapResponse.ok) throw new Error("Thêm chi tiết phiếu nhập thất bại");

            // Cập nhật hoặc thêm sản phẩm trong bảng sanpham
            const productData = {
                IdCHSP: product.IdCHSP,
                IdDongSanPham: product.IdDongSanPham,
                SoLuong: product.SoLuong,
                Gia: product.GiaBan,
                TrangThai: 1
            };
            const productResponse = await fetch("/smartstation/src/mvc/controllers/SanPhamController.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });
            if (!productResponse.ok) {
                const errorData = await productResponse.json();
                if (errorData.message === "Sản phẩm đã tồn tại và đang hoạt động.") {
                    // Cập nhật số lượng và giá bán
                    const existingProductResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${product.IdCHSP}&idDSP=${product.IdDongSanPham}`);
                    const existingProduct = await existingProductResponse.json();
                    const updateProductData = {
                        SoLuong: existingProduct.SoLuong + product.SoLuong,
                        Gia: product.GiaBan,
                        TrangThai: 1,
                        NgayNhap: ngayNhap
                    };
                    const updateResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${product.IdCHSP}&idDSP=${product.IdDongSanPham}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updateProductData),
                    });
                    if (!updateResponse.ok) throw new Error("Cập nhật sản phẩm thất bại");
                } else {
                    throw new Error(errorData.message || "Thêm sản phẩm thất bại");
                }
            }

            // Thêm sản phẩm chi tiết (sanphamchitiet)
            const sanPhamChiTietPromises = Array.from({ length: product.SoLuong }, async () => {
                const imei = await getUniqueIMEI();
                const sanPhamChiTietData = {
                    Imei: imei,
                    TrangThai: 1,
                    IdCHSP: product.IdCHSP,
                    IdDongSanPham: product.IdDongSanPham,
                    IdBaoHanh: product.IdBaoHanh,
                    IdPhieuNhap: idPhieuNhap
                };
                const spctResponse = await fetch("/smartstation/src/mvc/controllers/SanPhamChiTietController.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(sanPhamChiTietData),
                });
                if (!spctResponse.ok) throw new Error("Thêm sản phẩm chi tiết thất bại");
            });

            return Promise.all(sanPhamChiTietPromises);
        });

        await Promise.all(promises);

        toast({
            title: "Thành công",
            message: "Thêm phiếu nhập và sản phẩm chi tiết thành công",
            type: "success",
            duration: 3000,
        });

        bootstrap.Modal.getInstance(document.getElementById("addGRNModal")).hide();
        loadGRNs();
    } catch (error) {
        console.error("Error:", error);
        toast({
            title: "Lỗi",
            message: error.message || "Thêm phiếu nhập thất bại",
            type: "error",
            duration: 3000,
        });
    } finally {
        // Ẩn loading và kích hoạt lại form
        saveButton.disabled = false;
        saveButton.innerHTML = 'Lưu';
        form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    }
}

// Gắn sự kiện cho nút "Thêm phiếu nhập"
document.querySelector('[data-bs-target="#addGRNModal"]').addEventListener("click", showAddGRNModal);

// Gọi khi trang được tải
loadGRNs();
