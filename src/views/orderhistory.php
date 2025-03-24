<!-- views/orderhistory.php -->
<div id="orderHistory" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <div class="text-center mb-4">
                    <h5 class="modal-title mt-2">Lịch sử mua hàng</h5>
                </div>
                <div id="orderHistoryList">
                    <!-- Danh sách đơn hàng sẽ được thêm bằng JavaScript -->
                </div>
                <div id="orderHistoryEmpty" class="text-center" style="display: none;">
                    <p>Bạn chưa có đơn hàng nào.</p>
                </div>
            </div>
        </div>
    </div>
</div>