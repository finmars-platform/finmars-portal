(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');

	module.exports = function ($scope) {
		var vm = this;

		vm.members = [];
		vm.groups = [];
		membersAndGroupsService.getMembersOrGroups('members').then(function (data) {
			console.log('members is', data);
			vm.members = data.results;
		});
		membersAndGroupsService.getMembersOrGroups('groups').then(function (data) {
			console.log('members is', data);
			vm.groups = data.results;
		});
	}
}());