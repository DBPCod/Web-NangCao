$(document).ready(function () {
    function loadProducts(page) {
        $.ajax({
            url: "./src/public/product.json", // Đường dẫn file JSON
            method: "GET",
            dataType: "json",
            success: function (data) {
                let products = data[page]; // Lấy sản phẩm của trang hiện tại
                let productHTML = "";
                if (products) {
                    products.forEach(function (product) {
                        productHTML += `
                            <div class="col">
                                <div class="product-card">
                                    <img src="${product.image}" alt="${product.name
                            }">
                                    <div class="product-name">${product.name
                            }</div>
                                    <div class="product-specs">${product.specs
                            }</div>
                                    <div class="product-price">${product.price
                            } 
                                        ${product.old_price
                                ? `<span class="text-muted text-decoration-line-through">${product.old_price}</span>`
                                : ""
                            }
                                    </div>
                                    <div class="product-discount">${product.discount
                            }</div>
                                    <div class="product-points">${product.points
                            }</div>
                                    <button class="btn btn-success">MUA NGAY</button>
                                    <a href="#" class="btn btn-link">Chi tiết</a>
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
});

