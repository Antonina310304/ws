

function validateFormChangePass() {
    var inputs = $('.js-change-form input[type="password"]');
    var submit = $('.js-change-form button[type="submit"]');
    var errorText = {
        SHORT: 'Пароль должен состоять из 6+ символов',
        DIFFERENT: 'Пароли должны совпадать',
    }

    function isMatchPass() {
        return (inputs.eq(0).val() === inputs.eq(1).val());
    }

    function checkConfirmPass() {
        var parentInput = inputs.eq(1).parent().parent();

        if(isMatchPass()) {
            hideError(parentInput);
        } else {
            showError(parentInput, errorText.DIFFERENT);
        }

    }

    function controllerSubmitForm() {
        if(isMatchPass() && inputs.eq(0).val().length > 5) {
            submit.attr('disabled', false);
            inputs.each(function () {
                var parentInput = $(this).parent().parent();
                hideError(parentInput)
            })
        } else {
            submit.attr('disabled', true);
        }
    }

    function hideError(input) {
        input.removeClass('form-input--error');
    }

    function showError(input, error) {
        input.addClass('form-input--error');
        input.find('.form-input__error').text(error);
    }

    inputs.on('input', function () {
        var parentInput = $(this).parent().parent();
        hideError(parentInput)
    })

    inputs.eq(0).on('blur', function () {
        var value = $(this).val();
        //if(value < 1) return;

        var parentInput = $(this).parent().parent();

        if(value.length < 6) {
            showError(parentInput, errorText.SHORT)
        } else {
            hideError(parentInput);
        }
        controllerSubmitForm();

        if(inputs.eq(1).val().length !== 0) {
            checkConfirmPass();
        }
    })

    inputs.eq(1).on('blur', function () {
        checkConfirmPass();
        controllerSubmitForm();
    })
}

$(document).ready(function () {
    validateFormChangePass();
})
