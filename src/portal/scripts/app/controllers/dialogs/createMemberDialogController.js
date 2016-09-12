(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');

	module.exports = function ($scope, $mdDialog) {
		var vm = this;

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {username: vm.memberName, email: vm.memberEmail}});
		}

		vm.cancel = function () {
			$mdDialog.cancel();
		}
	}
}());