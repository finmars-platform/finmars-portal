(function() {
	
	'use strict';

	var logService = require('../../../../core/services/logService');

	module.exports = function ($scope, $mdDialog) {

		logService.controller('threadGroupDialogController', 'initialized');

		var vm = this;

		vm.cancel = function () {
			$mdDialog.hide();
		};

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {threadGroupTitle: vm.groupTitle}});
		}
	}

}());