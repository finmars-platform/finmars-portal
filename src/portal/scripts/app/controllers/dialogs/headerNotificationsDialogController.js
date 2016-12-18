(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');

	module.exports = function ($scope, $mdDialog) {
		var vm = this;

		logService.controller('EventScheduleConfigDialogController', 'initialized');

		vm.cancel = function () {
			$mdDialog.cancel();
		}
	}
}());