(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');

	module.exports = function ($scope, $mdDialog) {
		var vm = this;

		vm.members = [];
		vm.groups = [];
		membersAndGroupsService.getList('members').then(function (data) {
			console.log('members is', data);
			vm.members = data.results;
			vm.memberRole
		});
		membersAndGroupsService.getList('groups').then(function (data) {
			console.log('groups is', data);
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
				membersAndGroupsService.create('members', {username: data.data.username, email: data.data.email}).then(function() {
					console.log('member has been created');
				});
			});
		};

		vm.createGroupDialog = function (ev) {
			$mdDialog.show({
				controller: 'CreateGroupDialogController as vm',
				templateUrl: 'views/dialogs/create-group-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev
			}).then(function (data) {
				console.log("new group's data is", data);
				membersAndGroupsService.create('groups', {name: data.data.username}).then(function() {
					console.log('group has been created');
				});
			});
		}
	}
}());