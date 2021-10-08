$(function () {
    $('body')
        .on('submit', '.pd-agreement-form-js', function (e) {
            e.preventDefault();
            var $self = $(this),
                $container = $('.pd-agreement-container-js');

            $.ajax({
                type: 'POST',
                url: '/ajax/agreement.php',
                data: $self.serialize(),
                dataType: 'json',
                "success": function (response) {
                    if (response.success !== true) {
                        return false
                    }
                    $self.hide();
                }
            });
        })
        .on('click', '.pd-agreement-button-js', function (e) {
            e.preventDefault();
            $('.pd-agreement-form-js').trigger('submit');
        });
});