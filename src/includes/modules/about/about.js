
$(document).ready(function () {
//================================slick slider==================================


    function aboutSlider() {
        var swiper = false;

        function renderSlider() {
            var screenWidth = $(window).width();
            if(screenWidth < 480 && !swiper) {
                swiper = new Swiper($('.js-slider-progress')[0], {
                    slidesPerView: 'auto',
                });
            } else if(screenWidth > 479 && swiper) {
                console.log(swiper)
                swiper.destroy();
                swiper = false;
            }
        }

        renderSlider();
        $(window).resize(renderSlider);
    }

    aboutSlider();


//     $('.js-slider-progress').slick({
//         dots: false,
//         draggable: true,
//         infinite: false,
//         accessibility: false,
//         speed: 500,
//         fade: false,
//         arrows: false,
//         // centerPadding: '24px',
//         // centerMode: true,
//         variableWidth: true,
//         mobileFirst: true,
//         responsive: [
//             {
//                 breakpoint: 479,
//                 settings: 'unslick',
//             }
//         ]
//     });


//================================slick slider==================================

});