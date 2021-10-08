$('body').on('focus', '.js-form-callback [data-type="tel"]', function () {

    var scrollTop = $(this).offset().top;
    var offsetHeight = $(window).height();

    $('#callback').animate({
        scrollTop: offsetHeight
    }, 500);

})
