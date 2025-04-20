<!-- Filter Sidebar -->
<div class="col-lg-3 col-md-4">
    <!-- Nút bật/tắt filter cho màn hình nhỏ -->
    <button
        class="btn btn-primary d-md-none mb-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#filterCollapse"
        aria-expanded="false"
        aria-controls="filterCollapse">
        Lọc sản phẩm <i class="bi bi-funnel"></i>
    </button>
    <!-- Filter content -->
    <div class="filter-section collapse d-md-block" id="filterCollapse">
        <h5>LỰA CHỌN HÃNG</h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="apple" />
            <label class="form-check-label" for="apple">Apple</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="samsung" />
            <label class="form-check-label" for="samsung">Samsung</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="xiaomi" />
            <label class="form-check-label" for="xiaomi">Xiaomi</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="tecno" />
            <label class="form-check-label" for="tecno">Tecno</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="oppo" />
            <label class="form-check-label" for="oppo">Oppo</label>
        </div>
        <h5 class="mt-4">MỨC GIÁ</h5>
        <div class="price-range">
            <input
                type="range"
                class="form-range"
                min="400000"
                max="48500000"
                step="100000"
                value="400000" />
            <div class="d-flex justify-content-between">
                <span>400,000 đ</span>
                <span>48,500,000 đ</span>
            </div>
        </div>
        <h5 class="mt-4"></h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="app1" />
            <label class="form-check-label" for="app1">Dưới 3triệu</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="app2" />
            <label class="form-check-label" for="app2">3 đến 6 triệu</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="app3" />
            <label class="form-check-label" for="app3">6 đến 10 triệu</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="app4" />
            <label class="form-check-label" for="app3">6 đến 10 triệu</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="app5" />
            <label class="form-check-label" for="app3">Trên 10 triệu</label>
        </div><!-- Filter Dung lượng RAM -->
        <h5 class="mt-4">DUNG LƯỢNG RAM</h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="ram1" />
            <label class="form-check-label" for="ram1">2GB</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="ram2" />
            <label class="form-check-label" for="ram2">4GB</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="ram3" />
            <label class="form-check-label" for="ram3">6GB</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="ram4" />
            <label class="form-check-label" for="ram4">8GB</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="ram5" />
            <label class="form-check-label" for="ram5">12GB trở lên</label>
        </div>
        <!-- Filter Pin -->
        <h5 class="mt-4">DUNG LƯỢNG PIN</h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="pin1" />
            <label class="form-check-label" for="pin1">Dưới 3000mAh</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="pin2" />
            <label class="form-check-label" for="pin2">3000 - 4000mAh</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="pin3" />
            <label class="form-check-label" for="pin3">4000 - 5000mAh</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="pin4" />
            <label class="form-check-label" for="pin4">5000mAh trở lên</label>
        </div>
        <!-- Nút LỌC -->
        <div class="mt-4">
            <button class="btn btn-primary w-100" id="applyFilterBtn">LỌC</button>
        </div>
    </div>
</div>