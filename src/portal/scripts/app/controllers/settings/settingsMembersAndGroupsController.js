(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');

	module.exports = function ($scope, $mdDialog) {
		var vm = this;

		vm.members = [];
		vm.groups = [];
		membersAndGroupsService.getMembersOrGroups('members').then(function (data) {
			console.log('members is', data);
			vm.members = data.results;
			vm.memberRole
		});
		membersAndGroupsService.getMembersOrGroups('groups').then(function (data) {
			console.log('members is', data);
			vm.groups = data.results;
		});
		vm.createMemberDialog = function (ev) {
			$mdDialog.show({
				controller: 'CreateMemberDialogController as vm',
				templateUrl: 'views/dialogs/create-member-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev
			}).then(function (data) {
				console.log('new members data is', data);
			});
		};
	}
}());