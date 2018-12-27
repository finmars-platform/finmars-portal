(function () {

    'use strict';

    module.exports = function () {
        return {
            restriction: 'A',
            scope: {
                readFile: '='
            },
            link: function (scope, elem, attr) {
                console.log('input file directive');

                scope.$watch('readFile', function (value) {

                    if (!value) {

                        elem[0].value = '';

                        var inputId = attr.id,
                            dot = '.',
                            PLInput = dot.concat(inputId),
                            $inputPlaceHolder = $(PLInput);

                        $inputPlaceHolder.text('Select file');
                    }

                });

                $(elem).bind('change', function () {

                    var $inputValue = $(this).val(),
                        inputId = attr.id,
                        dot = '.',
                        PLInput = dot.concat(inputId),
                        $inputPlaceHolder = $(PLInput);

                    if ($inputValue && $inputValue.length > 0) {
                        scope.readFile = elem[0].files[0];

                        var $lastDivider;
                        var $fileName;
                        if ($inputValue.indexOf('\\') >= 0) {
                            $lastDivider = $inputValue.lastIndexOf('\\');
                        }
                        else if ($inputValue.indexOf('/') >= 0) {
                            $lastDivider = $inputValue.lastIndexOf('/');
                        }
                        $fileName = $inputValue.substring($lastDivider + 1);
                        $inputPlaceHolder.text($fileName);
                    }
                    else if ($inputPlaceHolder.text != 'Select file') {
                        scope.readFile = elem[0].files[0];

                        $inputPlaceHolder.text('Select file');
                    }
                });
            }
        }
    }
}());