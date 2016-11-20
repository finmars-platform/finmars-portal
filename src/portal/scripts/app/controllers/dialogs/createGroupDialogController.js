(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');

	module.exports = function ($scope, $mdDialog) {
		var vm = this;


		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {name: vm.groupName, members: []}});
		}

		vm.cancel = function () {
			$mdDialog.cancel();
		}
	}
}());