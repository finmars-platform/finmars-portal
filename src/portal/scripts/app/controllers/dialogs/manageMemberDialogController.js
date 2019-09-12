(function(){

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var membersAndGroupsService = require('../../services/membersAndGroupsService');
	
	module.exports = function($scope, $mdDialog, memberId) {

		var vm = this;

		vm.groupsList = [];
		vm.assignedGroupsList = [];
		vm.members = [];

		membersAndGroupsService.getList('groups').then(function (data) {
			vm.groupsList = data.results;

			membersAndGroupsService.getMemberOrGroupByKey('members', memberId).then(function (data) {
				vm.members = data;
				var assignedGroupsIds = vm.members.groups;
				// separate assigned groups from available
				if (assignedGroupsIds && assignedGroupsIds.length > 0) {

					assignedGroupsIds.map(function(assignedId) {
						vm.groupsList.map(function(group, groupIndex) {
							var groupId = group['id'];
							if (groupId === assignedId) {
								vm.groupsList.splice(groupIndex, 1);
								vm.assignedGroupsList.push(group);
							}
						});
					});

				}
				$scope.$apply();
			});

		});

		vm.cancel = function () {
			$mdDialog.hide();
		};

		vm.agree = function () {
			var assignedGroupsIds = [];
			if (vm.assignedGroupsList && vm.assignedGroupsList.length > 0) {
				vm.assignedGroupsList.map(function(group) {
					assignedGroupsIds.push(group['id']);
				});
			}
			$mdDialog.hide({status: 'agree', data: {isAdmin: vm.memberIsAdmin, groups: assignedGroupsIds, join_date: vm.members.join_date}});
		};
	}

}());