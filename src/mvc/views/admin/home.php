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
        $(document).ready(function() {
            $("#contentArea").load("../../../mvc/views/admin/pages/overview.php");

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
                            // Gọi hàm loadProducts nếu section là products
                            if (section === 'products' && typeof loadProducts === 'function') {
                                loadProducts();
                            }
                            if (section === 'statistics' && typeof loadTopUsers === 'function'){
                                loadTopUsers();
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