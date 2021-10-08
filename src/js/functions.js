function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

/* переключает класс overflow у body */

function onOverflow() {
    $('body').toggleClass('overflow')
}

function onOverflowBody() {
    $('body').addClass('overflow');

}

function offOverflowBody() {
    $('body').removeClass('overflow');
}

function onOverflowMob() {
    $('body').toggleClass('overflow-mob')
}

var dataType = {
    TEL: 'tel',
    EMAIL: 'email',
    TEXT: 'text',
    PASS: 'password'
}

/*******
 *
 * функция принимает 2 параметра
 * form - форма
 * params - объект с настройками для проверки
 * поля валидируются по атрибутам required и params.attr

 * тип поля проверяется по атрибуту params.attr
 * класс ошибки поля params.errorClass
 * поле для ошибки атрибут params.attrError
 *
 * *******/


function validateForm(form) {
    var validate = {
        errorClass: 'form-input--error',
        input: null,
        attr: 'data-type',
        attrError: 'data-field-error',
        arrayInput: [],
        errors: {
            TEXT: 'Введите Ваше имя',
            TEL: 'Введите корректный номер',
            DEFAULT: 'Заполните поле',
            EMAIL: 'Неверный формат почты',
            EMAIL_EMPTY: 'Введите email',
            ANY: 'Введите почту или телефон',
            PASS: 'Введите пароль',
        },
        form: form,

        isSubmitForm: function () {
            var that = this;
            var isValid = true;
            this.input.each(function () {
                var $this = $(this);
                isValid = isValid && that.isValidValue($this);
            });
            return isValid;
        },

        checkAllError: function() {
            var that = this;
            this.input.each(function () {
                var $this = $(this);
                var parent = $this.parent();
                that.checkError($this, parent);
            });
        },

        checkError: function(input, parent) {
            var typeData = input.attr(this.attr);
            var isPossible = input.data('possible');

            if(this.isValidValue(input)) {
                this.hideError(parent);

                if(typeData == 'email' && isPossible) {
                    this.hideError(this.formTel.parent())
                }
                if(typeData == 'tel' && isPossible) {
                    this.hideError(this.formEmail.parent())
                }

            } else {
                this.showError(parent, typeData);

                if(typeData == 'email' && isPossible) {
                    this.showError(this.formTel.parent(), dataType.TEL)
                }
                if(typeData == 'tel' && isPossible) {
                    this.showError(this.formEmail.parent(), dataType.EMAIL)
                }
            }

        },

        hideError: function (parent) {
            parent.removeClass(this.errorClass);
        },

        showError: function(parent, typeData) {
            var errorTextContainer = parent.find('[' + this.attrError + ']');
            var isPossible = parent.find('input').data('possible') ? true : false;
            var errorText;

            switch (typeData) {
                case dataType.TEL:
                    errorText = isPossible ? this.errors.ANY : this.errors.TEL;
                    break;
                case dataType.PASS:
                    errorText = this.errors.PASS;
                    break;
                case dataType.TEXT:
                    errorText = this.errors.TEXT;
                    break;
                case dataType.EMAIL:
                    var value = parent.find('.form-input__input').val().length;
                    if(isPossible) {
                        errorText = this.errors.ANY;
                    } else if(value == 0) {
                        errorText = this.errors.EMAIL_EMPTY
                    } else {
                        errorText = this.errors.EMAIL;
                    }
                    break;
            };
            errorTextContainer.text(errorText);
            parent.addClass(this.errorClass);
        },

        watch: function (input, parent) {
            var that = this;

            input.on('blur', function () {
                var value = $(this).val();
                if(value == '') return;
                that.checkError($(this), parent);
                that.watcherButtonSubmit();
            });

            function watcherButtonSubmit() {
                that.watcherButtonSubmit();
            }

            input.on('input', debounce(watcherButtonSubmit, 300));
            input.on('input', function () {
                that.hideError(parent);
            });
        },

        addMaskTel: function() {
            this.formTel = form.find('input[' + this.attr + '="tel"]').inputmask({
                mask: "+7 (999) 999-99-99",
                placeholder: "_",
                showMaskOnHover: false
            });
        },

        addMaskEmail: function () {
            this.formEmail = form.find('input[' + this.attr + '="email"]');
            this.formEmail.inputmask('email', {
                // mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
                placeholder: "",
            });
        },

        addResizeTextArea: function() {
            var textarea = form.find('[' + this.attr + '="textarea"]');
            autosize(textarea);
        },

        isFilledEmail() {
          return !!this.formEmail.val();
        },

        isValidEmail: function(address) {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(address) == true;
        },

        watcherButtonSubmit: function () {
            if(this.isSubmitForm()) {
                this.form.find('button[type="submit"]').attr('disabled', false);
            } else {
                this.form.find('button[type="submit"]').attr('disabled', true);
            }
        },
        isValidValue: function (input) {
            var value;
            var typeData = input.attr(this.attr);
            var isPossible = input.data('possible') ? true : false;

            var isValid = false;
            switch (typeData) {
                case 'tel':
                    var emailVal =  this.formEmail.val();
                    if(isPossible && this.isValidEmail(emailVal)) {
                        isValid = true;
                    } else {
                        value = input.inputmask('unmaskedvalue');
                        isValid = (value.length == 10);
                    }
                    break;
                case 'text':
                    value = input.val();
                    isValid = (value !== '');
                    break;
                case 'password':
                    value = input.val();
                    isValid = (value !== '');
                    break;
                case 'email':
                    if(this.isValidValue(this.formTel) && isPossible) {
                        isValid = true
                    } else {
                        value = input.val();
                        isValid = this.isValidEmail(value);
                    }
                    break;
                case 'textarea':
                    value = input.val();
                    isValid = (value !== '');
                    break;
            };


            return isValid;
        },

        init: function () {
            var that = this;
            this.input = this.form.find('.form-input__input['+ this.attr +'][required]');

            this.addMaskTel();
            this.addMaskEmail();
            this.addResizeTextArea();

            this.input.each(function () {
                var input = {};
                input.input = $(this);
                input.parent = $(this).parent();
                input.type = $(this).attr(that.attr);
                that.arrayInput.push(input);
                that.watch(input.input, input.parent);
            });
        }
    }

    return validate;
};



/**
* отправляет аякс запрос
* @param {params} параметры запроса
*
* */

function onSendAjax(params) {
    $.ajax({
        type: params.type,
        url: params.url,
        dataType: params.url,
        data: params.data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
         // при интеграции нужно перенести сюда функцию из complete
         //    params.onSuccess(data);
        },
        error: function (data) {
            // params.onError();
        },
        complete: function () {
            params.onSuccess();
        }
    });
}

/**
 * закрывает попап
 * */

function closePopup() {
    $.magnificPopup.close();
}

function onBtnCloseClick() {
    closePopup();
    $('#id-success-form').off('click', '.js-modal-close', onBtnCloseClick);
    $('#id-error-form').off('click', '.js-modal-close', onBtnCloseClick);
}

/**
 * открывает magnificPopup
 * @param {params} параметры попапа
 *
 * */

function onOpenPopup(params) {
    $.magnificPopup.open({
        removalDelay: 500,
        items: {
            src: params.src
        },
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = 'my-mfp-slide-bottom';
                $('html').addClass('mfp-helper');
            },
            close: function () {
                $('html').removeClass('mfp-helper');
            },

            open: function () {
                onOverflowBody();
                if(params.closePopup) {
                    params.closePopup();
                }
            },
            beforeClose: function () {
                offOverflowBody();
            },
            afterClose: function () {
                if(params.afterClose) {
                    params.afterClose();
                }

            },
        },
        type: params.type,
        closeBtnInside: params.showCloseBtn,
        showCloseBtn: params.showCloseBtn
    });

}

/**
 * открывает попап успешной отправки формы
 * */

function openSuccessFormPopup() {

    onOpenPopup({
        src: '#id-success-form',
        type: 'inline',
        // closeBtnInside: false,
        showCloseBtn: true,
        closePopup: function () {
            $('#id-success-form').on('click', '.js-modal-close', onBtnCloseClick);
        },
    });

}

/**
 * открывает попап неуспешной отправки формы
 * */

function openErrorFormPopup() {
    onOpenPopup({
        src: '#id-error-form',
        type: 'inline',
        //closeBtnInside: true,
        showCloseBtn: true,
        closePopup: function () {
            $('#id-error-form').on('click', '.js-modal-close', onBtnCloseClick);
        },
    })

}

/**
 * функция инициализации валидации, отправки формы с обратными уведомлениями
 * @param {formClass} класс формы
 * @param {params} параметры отправки запроса
 *
 * */

function initForm() {
    var form = $('.js-validate-form');

    form.each(function () {
        var validate = validateForm($(this));
        validate.init();
    })

}

initForm();


/**
 * плавный скролл до блока
 * принимает id блока до которого нужен скролл
* */
function scrollToBlock(id) {
    var block = $('#' + id);
    var scrollTop = block.offset().top;

    $('html, body').animate({
        scrollTop: scrollTop
    }, 500);
}

$(document).on('click', '[data-scroll]',function () {
    var idBlock = $(this).attr('data-scroll');
    scrollToBlock(idBlock)
})


/**
 * init select2
 * */
function initSelect2() {
    var block = $('[data-select]');
    block.select2({
        dropdownParent: $('.select-block'),
        minimumResultsForSearch: -1,
        placeholder: 'Выберете проект',
        width: '100%',
    });
}

function getScrollbarSize() {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';
    // add innerdiv
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    var widthWithScroll = inner.offsetWidth;
    // remove divs
    outer.parentNode.removeChild(outer);

    var scrollWidth;

    if(document.body.offsetHeight > window.innerHeight) {
        scrollWidth = widthNoScroll - widthWithScroll;
    } else {
        scrollWidth = 0;
    }

    return scrollWidth;
}


$('body').on('submit', '.js-default-form', function (evt) {
    evt.preventDefault();
    var _this = $(this);
    var url = _this.prop('action');
    _this.find('button[type=submit]').attr('disabled', true);

    var data = _this.serializeArray();

    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            successSubmitForm(data, _this);
        },
        error: function (data) {
            //_this[0].reset();
            openErrorFormPopup(data, _this);
        },
        complete: function () {
        }
    });

})


function successSubmitForm(data, form) {
    var currForm = form;
    console.log(currForm)
    if(data.success == 'OK') {
        openSuccessFormPopup();
        form[0].reset();
        form.find('.form-input').each(function () {
            $(this).removeClass('form-input');
        })
        return;
    }

    form.find('button[type="submit"]').attr('disabled', false);

    $.each(data.errors, function (ind, item) {
        var inputWrapper = currForm.find('[name="' + ind + '"]').parent();
        inputWrapper.addClass('form-input--error');
        inputWrapper.find('.form-input__error').text(item);
    })
}



$('body').on('submit', '.js-authorization-form', function (evt) {
    evt.preventDefault();
    var _this = $(this);
    var url = _this.prop('action');
    _this.find('button[type=submit]').attr('disabled', true);

    var data = _this.serializeArray();

    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            if(data.success == 'OK') {
                window.location.reload();
                return;
            }

            $.each(data.errors, function (ind, item) {
                var inputWrapper = _this.find('[name="' + ind + '"]').parent();
                inputWrapper.addClass('form-input--error');
                inputWrapper.find('.form-input__error').text(item);
            })

        },
        error: function (data) {
            //_this[0].reset();
            openErrorFormPopup(data, _this);
        },
        complete: function () {
        }
    });

})
