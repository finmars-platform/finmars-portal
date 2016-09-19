(function(){

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');
	
	module.exports = function($scope, $mdDialog, memberId) {

		var vm = this;

		vm.groupsList = [];
		vm.asignedGroupsList = [];
		vm.members = [];

		membersAndGroupsService.getList('groups').then(function (data) {
			var allGroupsList = data.results;

			membersAndGroupsService.getMemberOrGroupByKey('members', memberId).then(function (data) {
				vm.members = data;
				var asignedGroupsIds = vm.members.groups;
				// divise groups on selected and not
				if (asignedGroupsIds && asignedGroupsIds.length > 0) {
					asignedGroupsIds.map(function(asignedId) {
						allGroupsList.map(function(group) {
							var groupId = group['id'];
							if (groupId === asignedId) {
								vm.asignedGroupsList.push(group);
								console.log('asigned group is', group, vm.asignedGroupsList);
							}
							else {
								vm.groupsList.push(group);
							}
						});
					});
				}
				else {
					vm.groupsList = allGroupsList;
				}
				$scope.$apply();
			});

		});

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			var asignedGroupsIds = [];
			if (vm.asignedGroupsList && vm.asignedGroupsList.length > 0) {
				vm.asignedGroupsList.map(function(group) {
					asignedGroupsIds.push(group['id']);
				});
			}
			$mdDialog.hide({status: 'agree', data: {isAdmin: vm.memberIsAdmin, groups: asignedGroupsIds, join_date: vm.members.join_date}});
		};
	}

}());