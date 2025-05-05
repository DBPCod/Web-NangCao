// Hàm tìm kiếm sản phẩm
function searchProducts(page = 1) {
    const searchInputs = document.querySelectorAll('.search-bar input');
    let searchQuery = '';

    
    // Lấy từ khóa từ input tìm kiếm (desktop hoặc mobile)
    searchInputs.forEach(input => {
        if (input.value.trim()) {
            searchQuery = input.value.trim();
        }
    });
    
    // Thu thập các bộ lọc hiện tại
    const filters = collectFilters();

    // Thêm từ khóa tìm kiếm vào filters
    if (searchQuery) {
        filters.searchQuery = searchQuery;
    } else {
        delete filters.searchQuery; // Xóa nếu không có từ khóa
    }

    // Gọi loadProducts với bộ lọc đã cập nhật
    loadProducts(page, filters);

    // Xóa input tìm kiếm sau khi tìm (tùy chọn)
    // searchInputs.forEach(input => {
    //     input.value = '';
    // });
}

// Cập nhật buildQueryString để hỗ trợ tham số tìm kiếm
function buildQueryString(filters, page) {
    const params = new URLSearchParams();
    params.append('page', page);

    if (filters.brands && filters.brands.length > 0) {
        params.append('brands', filters.brands.join(','));
    }
    if (filters.priceRanges && filters.priceRanges.length > 0) {
        params.append('priceRanges', filters.priceRanges.join(','));
    }
    if (filters.priceMin) {
        params.append('priceMin', filters.priceMin);
    }
    if (filters.priceMax) {
        params.append('priceMax', filters.priceMax);
    }
    if (filters.rams && filters.rams.length > 0) {
        params.append('rams', filters.rams.join(','));
    }
    if (filters.pins && filters.pins.length > 0) {
        params.append('pins', filters.pins.join(','));
    }
    if (filters.searchQuery) {
        params.append('q', filters.searchQuery);
    }

    return params.toString();
}

// Hàm xử lý sự kiện click nút tìm kiếm
function handleClickSearch() {
    searchProducts(1);
    
    // Đóng offcanvas sau khi tìm kiếm (nếu đang mở)
    const offcanvas = document.getElementById('navbarOffcanvas');
    if (offcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
    }
}

// Gắn sự kiện nhấn Enter trên input tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    const searchInputs = document.querySelectorAll('.search-bar input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts(1);
            }
        });
    });
});
