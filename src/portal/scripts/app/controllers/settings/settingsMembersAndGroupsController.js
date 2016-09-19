(function() {

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');

	module.exports = function ($scope, $mdDialog) {
		var vm = this;

		vm.members = [];
		vm.groups = [];
		vm.getList = function () {
			membersAndGroupsService.getList('members').then(function (data) {
				console.log('members is', data);
				vm.members = data.results;

				membersAndGroupsService.getList('groups').then(function (data) {
					console.log('groups is', data);
					vm.groups = data.results;

					// add member's groups name
					vm.members.map(function(member) {
						var groupsOfMember = member['groups'];
						if (groupsOfMember && groupsOfMember.length > 0) {
							member.groupsName = [];
							groupsOfMember.map(function(memberGroupId) {
								vm.groups.map(function(group) {
									if (group['id'] === memberGroupId) {
										member.groupsName.push(group['name']);
									}
								});
							});
						};
					})
				});
			});
		};
		// membersAndGroupsService.getList('groups').then(function (data) {
		// 	console.log('groups is', data);
		// 	vm.groups = data.results;
		// });
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

		vm.manageMemberDialog = function (ev, memberId) {
			$mdDialog.show({
				controller: 'ManageMemberDialogController as vm',
				templateUrl: 'views/dialogs/manage-member-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					memberId: memberId
				}
			}).then(function (data) {
				membersAndGroupsService.update('members', memberId, {is_admin: data.data.isAdmin, groups: data.data.groups, join_date: data.data.join_date}).then(function () {
					vm.getList();
					console.log('member is updated');
				});
			});
		}

		vm.manageGroupDialog = function (ev, groupId) {
			$mdDialog.show({
				controller: 'ManageGroupDialogController as vm',
				templateUrl: 'views/dialogs/manage-group-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					groupId: groupId
				}
			}).then(function (data) {
				// console.log('group data is', data);
				membersAndGroupsService.update('groups', groupId, {name: data.data.name, members: data.data.members}).then(function () {
					vm.getList();
					console.log('member is updated');
				});
			});
		}

		vm.getList();
	}
}());