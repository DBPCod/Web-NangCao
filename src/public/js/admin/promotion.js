
    function loadPromotions() {
        fetch("/smartstation/src/mvc/controllers/KhuyenMaiController.php", {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((promotions) => {
                const tbody = document.getElementById("promotionTableBody");
                tbody.innerHTML = "";
                if (!promotions || promotions.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6">Không có khuyến mãi nào</td></tr>';
                } else {
                    promotions.forEach((promotion) => {
                        tbody.innerHTML += `
                            <tr>
                                <td>${promotion.IdKhuyenMai}</td>
                                <td>${promotion.NgayBatDau}</td>
                                <td>${promotion.NgayKetThuc}</td>
                                <td>${promotion.PhanTramGiam}%</td>
                                <td>${promotion.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="viewPromotionDetails('${promotion.IdKhuyenMai}')">Xem chi tiết</button>
                                    <button class="btn btn-danger" onclick="deletePromotion('${promotion.IdKhuyenMai}')">Xóa</button>
                                </td>
                            </tr>`;
                    });
                }
            })
            .catch((error) => console.error("Fetch error in loadPromotions:", error));
    }

    function viewPromotionDetails(idKhuyenMai) {
        console.log("viewPromotionDetails called with idKhuyenMai:", idKhuyenMai);
        fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}&action=getProductLines`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((productLines) => {
                console.log("Product lines received:", productLines);
                const list = document.getElementById("productLineList");
                if (!list) {
                    console.error("Element #productLineList not found!");
                    return;
                }
                list.innerHTML = "";
                if (!productLines || productLines.length === 0) {
                    list.innerHTML = '<li class="list-group-item">Không có dòng sản phẩm nào được áp dụng</li>';
                } else {
                    productLines.forEach((line) => {
                        list.innerHTML += `<li class="list-group-item">${line.TenDong}</li>`;
                    });
                }
                const modalElement = document.getElementById("productLineModal");
                if (!modalElement) {
                    console.error("Modal element #productLineModal not found!");
                    return;
                }
                modalElement.classList.add("show");
                modalElement.style.display = "block";
                document.body.classList.add("modal-open");
                console.log("Modal should be visible now (manual)");

                const closeButton = modalElement.querySelector(".btn-close");
                closeButton.addEventListener("click", () => {
                    modalElement.classList.remove("show");
                    modalElement.style.display = "none";
                    document.body.classList.remove("modal-open");
                });

                const btnSecondary = modalElement.querySelector(".btn-secondary");
                btnSecondary.addEventListener("click", () => {
                    modalElement.classList.remove("show");
                    modalElement.style.display = "none";
                    document.body.classList.remove("modal-open");
                });
            })
            .catch((error) => {
                console.error("Error in viewPromotionDetails:", error);
                alert("Có lỗi khi tải dữ liệu. Kiểm tra console.");
            });
    }

    function deletePromotion(idKhuyenMai) {
        if (confirm("Bạn có chắc muốn ngừng hoạt động khuyến mãi này?")) {
            fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}`, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((promotion) => {
                    if (promotion.TrangThai == 1) {
                        return fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}`, {
                            method: "DELETE",
                        });
                    } else {
                        alert("Khuyến mãi không còn hoạt động.");
                        throw new Error("Khuyến mãi không còn hoạt động.");
                    }
                })
                .then((response) => response.json())
                .then((data) => {
                    toast({
                        title: "Thành công",
                        message: "Xóa thành công",
                        type: "success",
                        duration: 3000,
                      });
                    loadPromotions();
                })
                .catch((error) => {
                    console.error("Error in deletePromotion:", error);
                });
        }
    }

    let allProductLines = [];
    function loadProductLinesForAdd() {
        fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((productLines) => {
                allProductLines = productLines;
                renderProductLines(productLines);
            })
            .catch((error) => console.error("Error loading product lines:", error));
    }

    function renderProductLines(productLines) {
        const tbody = document.getElementById("productLineTableBody");
        tbody.innerHTML = "";
        productLines.forEach((line) => {
            tbody.innerHTML += `
                <tr>
                    <td><input class="form-check-input product-line-checkbox" type="checkbox" value="${line.IdDongSanPham}" id="productLine_${line.IdDongSanPham}"></td>
                    <td>${line.TenDong}</td>
                </tr>`;
        });
    }

    document.getElementById("productLineSearch").addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLines = allProductLines.filter((line) =>
            line.TenDong.toLowerCase().includes(searchTerm)
        );
        renderProductLines(filteredLines);
    });

    document.getElementById("selectAll").addEventListener("change", function (e) {
        const checkboxes = document.querySelectorAll(".product-line-checkbox");
        checkboxes.forEach((checkbox) => {
            checkbox.checked = e.target.checked;
        });
    });

    document.getElementById("addPromotionForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const promotionData = {
            NgayBatDau: document.getElementById("startDate").value,
            NgayKetThuc: document.getElementById("endDate").value,
            PhanTramGiam: document.getElementById("discountPercent").value,
            TrangThai: 1
        };

        fetch("/smartstation/src/mvc/controllers/KhuyenMaiController.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(promotionData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Thêm khuyến mãi thành công") {
                    const newIdKhuyenMai = data.khuyenmai.IdKhuyenMai;
                    const selectedProductLines = Array.from(document.querySelectorAll(".product-line-checkbox:checked"))
                        .map(checkbox => checkbox.value);

                    const promises = selectedProductLines.map((idDongSanPham) => {
                        console.log("Adding CTKhuyenMai for IdDongSanPham:", idDongSanPham);
                        return fetch("/smartstation/src/mvc/controllers/CTKhuyenMaiController.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                IdKhuyenMai: newIdKhuyenMai,
                                IdDongSanPham: idDongSanPham
                            }),
                        });
                    });

                    Promise.all(promises)
                        .then(() => {
                            console.log(promises);
                            toast({
                                title: "Thành công",
                                message: "Thêm thành công",
                                type: "success",
                                duration: 3000,
                              });
                            loadPromotions();
                            document.getElementById("addPromotionModal").querySelector(".btn-close").click();
                        })
                        .catch((error) => console.error("Error adding product lines:", error));
                } else {
                    toast({
                        title: "Lỗi",
                        message: "Xóa thất bại.",
                        type: "error",
                        duration: 3000,
                      });
                }
            })
            .catch((error) => console.error("Error adding promotion:", error));
    });

    document.getElementById("addPromotionModal").addEventListener("show.bs.modal", function () {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("startDate").value = today;
        loadProductLinesForAdd();
    });

    loadPromotions();