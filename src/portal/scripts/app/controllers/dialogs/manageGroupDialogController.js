(function(){

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');
	
	module.exports = function($scope, $mdDialog, groupId) {

		var vm = this;

		vm.membersList = [];
		vm.asignedMembersList = [];
		vm.groups = [];

		membersAndGroupsService.getList('members').then(function (data) {
			var allMembersList = data.results;

			membersAndGroupsService.getMemberOrGroupByKey('groups', groupId).then(function (data) {
				vm.groups = data;
				console.log('groups is', data);
				var asignedMembersIds = vm.groups.members;
				// divise groups on selected and not
				if (asignedMembersIds && asignedMembersIds.length > 0) {
					asignedMembersIds.map(function(asignedId) {
						allMembersList.map(function(member) {
							var memberId = member['id'];
							if (memberId === asignedId) {
								vm.asignedMembersList.push(member);
								console.log('asigned member is', member, vm.asignedMembersList);
							}
							else {
								vm.membersList.push(member);
							}
						});
					});
				}
				else {
					vm.membersList = allMembersList;
					console.log('vm.membersList is', vm.membersList);
				}
				$scope.$apply();
			});

		});

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			var asignedMembersIds = [];
			if (vm.asignedMembersList && vm.asignedMembersList.length > 0) {
				vm.asignedMembersList.map(function(group) {
					asignedMembersIds.push(group['id']);
				});
			}
			$mdDialog.hide({status: 'agree', data: {members: asignedMembersIds, name: vm.groups.name}});
		};
	}

}());