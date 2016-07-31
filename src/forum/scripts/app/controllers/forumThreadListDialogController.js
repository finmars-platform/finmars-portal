(function() {
	
	'use strict';

	var logService = require('../../../../core/services/logService');

	module.exports = function ($scope, $mdDialog) {

		logService.controller('threadListDialogController', 'initialized');

		var vm = this;

		vm.cancel = function () {
			$mdDialog.cancel();
		}

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {threadListTitle: vm.listTitle}});
		}
	}

}());