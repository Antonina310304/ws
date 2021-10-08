

function casesSwiper() {
    var caseSwiper = new Swiper($('.cases-swiper .swiper-container')[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        breakpoints: {
           480: {
               slidesPerView: 2,
               spaceBetween: 31,
           },
           1024: {
               slidesPerView: 3,
               spaceBetween: 32,
           },
        },
        navigation: {
            nextEl: '.cases-swiper .cases-swiper__btn.next',
            prevEl: '.cases-swiper .cases-swiper__btn.prev',
            disabledClass: 'disabled',
        },
    } )
}

$(document).ready(function () {
    casesSwiper();
})