<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartStation</title>

    <link rel="shortcut icon" href="../../../public/img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="../../../public/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../../public/css/admin.css">
    <link rel="stylesheet" href="../../../public/toast_message/main.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>
    <div id="toast" class="toast-container"></div>
    <div class="container-fluid">
        <div class="row">
            <?php include '../../../mvc/views/admin/includes/sidebar.php'; ?>
            <div class="col-md-9 col-lg-10 content-area">
                <div id="contentArea"></div>
            </div>
        </div>
    </div>
    <button class="btn" id="sidebarToggle">☰</button> <!-- Nút toggle -->

    <script src="../../../public/js/jquery.js"></script>
    <script src="../../../public/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../../../public/toast_message/main.js"></script>
    <script>
        $(document).ready(async function() {
            let permissions = [];

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
                    alert('Không thể tải dữ liệu quyền!');
                }
            }

            // Hàm kiểm tra quyền
            function hasPermission(permissionName, action) {
                return permissions.some(permission => 
                    permission.TenQuyen === permissionName && permission[action]
                );
            }

            // Ánh xạ section với TenQuyen
            const sectionPermissions = {
                'customers': 'Khách hàng',
                'products': 'Danh sách sản phẩm',
                'productLine': 'Dòng sản phẩm',
                'productConfig': 'Cấu hình sản phẩm',
                'brand': 'Thương hiệu',
                'promotions': 'Khuyến mãi',
                'warranty': 'Bảo hành',
                'grn': 'Danh sách phiếu nhập',
                'providers': 'Nhà cung cấp',
                'orders': 'Đơn hàng',
                'statistics': 'Thống kê',
                'users': 'Quản trị'
            };

            // Tải dữ liệu quyền trước khi xử lý giao diện
            await loadPermissions();

            // Ẩn các section không có quyền truy cập
            $(".nav-link[data-section]").each(function() {
                const section = $(this).data("section");
                const permissionName = sectionPermissions[section];
                if (permissionName && !hasPermission(permissionName, "xem")) {
                    $(this).hide();
                }
            });

            // // Ẩn các menu cha nếu tất cả menu con bị ẩn
            // const collapsibleMenus = [
            //     { parent: '#userMenu', toggle: 'a[href="#userMenu"]' },
            //     { parent: '#productMenu', toggle: 'a[href="#productMenu"]' },
            //     { parent: '#grnMenu', toggle: 'a[href="#grnMenu"]' }
            // ];

            // collapsibleMenus.forEach(menu => {
            //     const $collapse = $(menu.parent);
            //     const $childLinks = $collapse.find('.nav-link[data-section]');
            //     const allChildrenHidden = $childLinks.length > 0 && $childLinks.toArray().every(link => $(link).is(':hidden'));
            //     if (allChildrenHidden) {
            //         $(menu.toggle).hide();
            //         $collapse.hide();
            //     }
            // });

            // Load trang tổng quan ban đầu
            $("#contentArea").load("../../../mvc/views/admin/pages/overview.php");

            // Xử lý click vào nav-link
            $(".nav-link[data-section]").click(function(e) {
                e.preventDefault();
                let section = $(this).data("section");

                if (section) {
                    let newUrl = `http://localhost/smartstation/src/mvc/views/admin/?page=${section}`;
                    window.history.pushState({
                        section: section
                    }, '', newUrl);

                    $.ajax({
                        url: "../../../mvc/views/admin/pages/" + section + ".php",
                        type: "GET",
                        success: function(data) {
                            $("#contentArea").html(data);
                            if (section === 'products' && typeof loadProducts === 'function') {
                                loadProducts();
                            }
                            if (section === 'statistics' && typeof loadTopUsers === 'function') {
                                loadTopUsers();
                            }
                            if (section === 'users' && typeof loadRoles === 'function') {
                                loadRoles();
                            }
                        },
                        error: function() {
                            $("#contentArea").html("<p class='text-danger'>Không thể tải trang!</p>");
                        }
                    });
                }
            });

            // Toggle sidebar
            $("#sidebarToggle").click(function() {
                console.log('Toggle clicked');
                if ($(window).width() <= 767) {
                    $(".sidebar").toggleClass("show");
                } else {
                    $(".sidebar").toggleClass("hidden");
                    $(".header").toggleClass("full-width");
                    $(".content-area").toggleClass("full-width");
                }
            });

            // Xử lý khi người dùng nhấn back/forward trên trình duyệt
            window.onpopstate = function(event) {
                if (event.state && event.state.section) {
                    $("#contentArea").load("../../../mvc/views/admin/pages/" + event.state.section + ".php");
                }
            };

            // Load trang ban đầu từ URL nếu có param
            const urlParams = new URLSearchParams(window.location.search);
            const initialPage = urlParams.get('page');
            if (initialPage) {
                $("#contentArea").load("../../../mvc/views/admin/pages/" + initialPage + ".php");
            }
        });
    </script>
</body>

</html>