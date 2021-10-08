function initDropzone(params) {

    Dropzone.autoDiscover = false;

    params.el.dropzone({
        url: 'http://localhost/upload-files.php',
        autoProcessQueue: false,
        maxFilesize: 2,
        addRemoveLinks: true,
        acceptedFiles: 'image/*, application/pdf, .psd, .doc, .docx, .xls, .xlsx, .odt, .odf,',
        previewTemplate: params.previewTemplate,
        previewsContainer: params.previewsContainer,
        createImageThumbnails: false,
        dictFileTooBig: ': pазмер файла предывашает допустимый размер в 2МБ',
        init: function () {
            var totalSize = 0;

            this.on("addedfile", function(file) {
                totalSize += parseFloat((file.size / (1024*1024)).toFixed(2));

                if(totalSize > 2) {
                    $('#errorMaxSize').show();
                    $('#errorMaxSize').text('Размер всех файлов не должен превышать 2Мб');
                    $('.js-dropzone-form button[type="submit"]').attr('disabled', true);
                } else {
                    $('#errorMaxSize').hide();
                }
            })

            this.on("removedfile", function(file) {
                totalSize -= parseFloat((file.size / (1024*1024)).toFixed(2));

                if(totalSize < 2) {
                    $('#errorMaxSize').hide();
                    if(params.isSubmit()) {
                        $('.js-dropzone-form button[type="submit"]').attr('disabled', false);
                    }
                }
            })

            var form = this;
            $('.js-validate-form button[type="submit"]').on('click', function () {
                form.processQueue();
            })
        },

        success: function () {
            // удаление файлов при успешной загрузке
            $('.dropzone-block__preview').remove()
        },

        error: function () {
            // удаление файлов при ошибке загрузки
            $('.dropzone-block__preview').remove()
        },

    });
}
