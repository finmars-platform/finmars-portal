(function () {

	'use strict';

	var logService = require('../../../../../core/services/logService');

	module.exports = function () {
		return {
			restrict: 'A',
			scope: {},
			link: function (scope, elem, attrs) {

				logService.component('groupVerticalScroll', 'initialized');

				function decreaseScrollBarMargin() {
					console.log("scroll margin decreased");
					$(elem).find('#mCSB_2_container').css({
						'margin-right': '8px'
					});
				}

				$(elem).mCustomScrollbar({
					axis: "y",
					callbacks: {
						onInit: decreaseScrollBarMargin,
						onBeforeUpdate: decreaseScrollBarMargin
					}
				});


			}
		}
	}

}());