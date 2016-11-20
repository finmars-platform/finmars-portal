(function () {

	'use strict';

	module.exports = function () {
		return {
			restriction: 'A',
			link: function (scope, elem, attr) {
				console.log('input file directive');
				var inputFile = $('input#providerConfigFile');
				$(elem).on('change', function () {
					console.log('chosen file is 111', this.files);
				});
			}
		}
	}
}());