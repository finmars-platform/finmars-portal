(function() {
	'use strict';

	var logService = require('../../../../core/services/logService');

	module.exports = function () {
		return {
			restrict: 'A',
			scope: {
				rows: '=',
				columnsNames: '=',
				columns: '='
			},
			templateUrl: 'views/directives/members-groups-table-view.html'
		}
	}
}());