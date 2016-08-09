(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');

	return {
		restrict: 'A',
		scope: {},
		link: function (scope, elem, attr) {

			logService.component('viewSectionResizer', 'initialized');
		}
	}
}
());