$(document).ready(function () {
    function loadProducts(page) {
        $.ajax({
            url: "./src/public/product.jsonjson", // Đường dẫn file JSON
            method: "GET",
            dataType: "json",
            success: function (data) {
                let products = data[page]; // Lấy sản phẩm của trang hiện tại
                let productHTML = "";
                if (products) {
                    products.forEach(function (product) {
                        productHTML += `
                            <div class="col">
                                <div class="product-card" data-bs-toggle="modal" data-bs-target="#productModal" data-product='${JSON.stringify(product)}'>
                                    <img src="${product.image}" alt="${product.name}">
                                    <div class="product-name">${product.name}</div>
                                    <div class="product-specs">${product.specs}</div>
                                    <div class="product-price">${product.price} 
                                        ${product.old_price
                                            ? `<span class="text-muted text-decoration-line-through">${product.old_price}</span>`
                                            : ""
                                        }
                                    </div>
                                    <div class="product-discount">${product.discount}</div>
                                    <div class="product-points">${product.points}</div>
                                </div>
                            </div>`;
                    });
                }
                $(".product-grid").html(productHTML); // Đổ dữ liệu vào grid
                $(".pagination .page-item").removeClass("active");
                $(`.pagination .page-btn[data-page='${page}']`)
                    .parent()
                    .addClass("active");
                $(".prev-page").attr("data-page", Math.max(1, page - 1));
                $(".next-page").attr("data-page", Math.min(3, page + 1));
            },
        });
    }

    // Load trang đầu tiên
    loadProducts(1);

    // Xử lý click vào số trang
    $(".pagination").on("click", ".page-btn", function (e) {
        e.preventDefault();
        let page = $(this).data("page");
        loadProducts(page);
    });

    // Xử lý nút Previous và Next
    $(".pagination").on("click", ".prev-page, .next-page", function (e) {
        e.preventDefault();
        let page = parseInt($(this).data("page"));
        loadProducts(page);
    });

    // Xử lý khi click vào product card để hiển thị modal
    $(".product-grid").on("click", ".product-card", function () {
        let product = $(this).data("product"); // Lấy dữ liệu sản phẩm từ data-product
        // Điền thông tin vào modal
        $("#modalProductImage").attr("src", product.image).attr("alt", product.name);
        $("#modalProductName").text(product.name);
        $("#modalProductSpecs").text(product.specs);
        $("#modalProductPrice").html(`${product.price} ${product.old_price ? `<span class="text-muted text-decoration-line-through">${product.old_price}</span>` : ""}`);
        $("#modalProductDiscount").text(product.discount);
        $("#modalProductPoints").text(product.points);
        // Điền thông số kỹ thuật
        $("#modalProductRam").text(product.ram || "N/A");
        $("#modalProductRom").text(product.rom || "N/A");
        $("#modalProductManHinh").text(product.manHinh || "N/A");
        $("#modalProductPin").text(product.pin || "N/A");
        $("#modalProductMauSac").text(product.mauSac || "N/A");
        $("#modalProductCamera").text(product.camera || "N/A");
        $("#modalProductTrangThai").text(product.trangThai ? "Còn hàng" : "Hết hàng");

        // Điền ảnh vào thumbnail gallery
        let thumbnailHTML = "";
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach(function (imgSrc, index) {
                thumbnailHTML += `
                    <img src="${imgSrc}" alt="${product.name} thumbnail ${index + 1}" class="thumbnail-image" data-index="${index}">
                `;
            });
        } else {
            // Nếu không có mảng images, chỉ hiển thị ảnh chính
            thumbnailHTML = `
                <img src="${product.image}" alt="${product.name} thumbnail" class="thumbnail-image" data-index="0">
            `;
        }
        $(".thumbnail-gallery").html(thumbnailHTML);

        // Thêm active class cho thumbnail đầu tiên
        $(".thumbnail-image").first().addClass("active");
    });

    // Xử lý khi click vào thumbnail để thay đổi ảnh chính
    $("#productModal").on("click", ".thumbnail-image", function () {
        let imgSrc = $(this).attr("src");
        $("#modalProductImage").attr("src", imgSrc); // Thay đổi ảnh chính
        // Xóa class active từ tất cả thumbnail và thêm vào thumbnail được click
        $(".thumbnail-image").removeClass("active");
        $(this).addClass("active");
    });
});