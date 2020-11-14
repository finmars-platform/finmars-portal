(function () {

	'use strict';

	module.exports = function ($mdDialog) {
		return {
			restrict: 'E',
			scope: {
				row: '=',
				column: '=',
				gtDataService: '=',
				gtEventService: '='
			},
			templateUrl: 'views/directives/gridTable/grid-table-cell-view.html',
			link: function (scope, elem, attrs) {

				let formatDataForChips = function () {



				};



			}

		}
	}

}());