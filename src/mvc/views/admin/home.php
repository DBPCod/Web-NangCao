<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartStation</title>
    <link rel="shortcut icon" href="../../../public/img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="../../../public/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../../public/css/admin.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
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
    <script>
        $(document).ready(function() {
            $("#contentArea").load("../../../mvc/views/admin/pages/dashboard.php");
            $(".nav-link[data-section]").click(function(e) {
                e.preventDefault();
                let page = $(this).data("section");
                if (page) {
                    $.ajax({
                        url: "../../../mvc/views/admin/pages/" + page + ".php",
                        type: "GET",
                        success: function(data) {
                            $("#contentArea").html(data);
                        },
                        error: function() {
                            $("#contentArea").html("<p class='text-danger'>Không thể tải trang!</p>");
                        }
                    });
                }
            });
            $("#sidebarToggle").click(function() {
                $(".sidebar").toggleClass("show");
            });
        });
    </script>
</body>
</html>