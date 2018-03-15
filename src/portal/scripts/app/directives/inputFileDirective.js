(function () {

	'use strict';

	module.exports = function () {
		return {
			restriction: 'A',
			link: function (scope, elem, attr) {
				console.log('input file directive');

				$(elem).on('change', function () {
                    var $inputValue = $(this).val(),
                        inputId = attr.id,
                        dot = '.',
                        PLInput = dot.concat(inputId),
                        $inputPlaceHolder = $(PLInput);

					if ($inputValue && $inputValue.length > 0) {
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
						$inputPlaceHolder.text('Select file');
					}
                    console.log('chosen file is 111', attr, attr.id, PLInput);
				});
			}
		}
	}
}());