(function(){

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');
	
	module.exports = function($scope, $mdDialog, groupId) {

		var vm = this;

		vm.membersList = [];
		vm.assignedMembersList = [];
		vm.groups = [];

		membersAndGroupsService.getList('members').then(function (data) {
			vm.membersList = data.results;

			membersAndGroupsService.getMemberOrGroupByKey('groups', groupId).then(function (data) {
				vm.groups = data;
				console.log('groups is', data);
				var assignedMembersIds = vm.groups.members;
				// separate assinged members from available
				if (assignedMembersIds && assignedMembersIds.length > 0) {
					assignedMembersIds.map(function(assignedId) {
						// allMembersList.map(function(member, memberIndex) {
						vm.membersList.map(function(member, memberIndex) {
							var memberId = member['id'];
							if (memberId === assignedId) {
								vm.membersList.splice(memberIndex, 1);
								vm.assignedMembersList.push(member);
							}
						});
					});
				}
				$scope.$apply();
			});

		});

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			var assignedMembersIds = [];
			if (vm.assignedMembersList && vm.assignedMembersList.length > 0) {
				vm.assignedMembersList.map(function(group) {
					assignedMembersIds.push(group['id']);
				});
			}
			$mdDialog.hide({status: 'agree', data: {members: assignedMembersIds, name: vm.groups.name}});
		};
	}

}());