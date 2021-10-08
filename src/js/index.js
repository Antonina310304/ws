//инициализация открытия модальных окон
$('[data-toggle="modal"]').on('click', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var modal = $(this).attr('data-target');

    if(modal == 'authorization' || modal == 'callback') {
        $('.main-nav').removeClass('show');
        $('.burger').removeClass('open');
        onOverflow();
    }
    // debugger
    onOpenPopup({
        src: '#' + modal,
        type: 'inline',
        closeBtnInside: true,
        showCloseBtn: true,
        closePopup: function () {
            $('.modal').on('click', '.js-modal-close', onBtnCloseClick);
        },
    });
})

//инициализация селектов
initSelect2();