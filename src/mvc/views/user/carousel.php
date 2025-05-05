<!-- Slider Section -->
<section class="slider-section">
    <div class="container">
        <div id="promoCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <!-- Indicators -->
            <div class="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#promoCarousel"
                    data-bs-slide-to="0"
                    class="active"
                    aria-current="true"
                    aria-label="Slide 1"></button>
                <button
                    type="button"
                    data-bs-target="#promoCarousel"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                <button
                    type="button"
                    data-bs-target="#promoCarousel"
                    data-bs-slide-to="2"    
                    aria-label="Slide 3"></button>
            </div>

            <!-- Slides -->
            <div class="carousel-inner">
                <!-- Slide 1 -->
                <div class="carousel-item active" data-idchsp="7" data-iddongsanpham="8" style="cursor: pointer;">
                    <!-- Placeholder for the image -->
                    <img
                        src="../../../public/img/slider1.jpg"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>

                <!-- Slide 2 (Placeholder) -->
                <div class="carousel-item" data-idchsp="8" data-iddongsanpham="12" style="cursor: pointer;">
                    <img
                        src="../../../public/img/slider2.png"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>

                <!-- Slide 3 (Placeholder) -->
                <div class="carousel-item" data-idchsp="1" data-iddongsanpham="5" style="cursor: pointer;">
                    <img
                        src="../../../public/img/slider3.png"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>
            </div>

            <!-- Controls -->
            <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#promoCarousel"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#promoCarousel"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
</section>
