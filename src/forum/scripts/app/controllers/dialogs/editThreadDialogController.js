(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var tagService = require('../../../../../portal/scripts/app/services/tagService');
	var threadService = require('../../services/threadService');

	var usersService = require('../../../../../portal/scripts/app/services/usersService');
	var usersGroupService = require('../../../../../portal/scripts/app/services/usersGroupService');
	
	module.exports = function ($scope, $mdDialog, threadId) {
		var vm = this;

		vm.tags = [];
		tagService.getListByContentType("thread", "tag").then(function (data) {
			vm.tags = data.results;
			$scope.$apply();
		});

		vm.thread = [];
		threadService.getByKey(threadId).then(function(data) {
			// vm.thread = data.results;
			vm.thread = data;
			vm.threadName = data.subject;
			vm.threadTags = data.tags[0];
			vm.loadPermissions();
			$scope.$apply();
		})

		vm.readyStatus = {permissions: false};
		vm.groups = [];
		vm.members = [];

		vm.loadPermissions = function () {

			var promises = [];

			promises.push(vm.getGroupList());
			promises.push(vm.getMemberList());

			Promise.all(promises).then(function (data) {

				// vm.readyStatus.permissions = true;
				// $scope.$apply();
			});

		};

		vm.getGroupList = function () {
			return usersGroupService.getList().then(function (data) {

				vm.groups = data.results;

				vm.groups.forEach(function (group) {

					if (vm.thread["group_object_permissions"]) {
						vm.thread["group_object_permissions"].forEach(function (permission) {

							if (permission.group == group.id) {
								if (!group.hasOwnProperty('objectPermissions')) {
									group.objectPermissions = {};
								}
								if (permission.permission === "manage_thread") {
									group.objectPermissions.manage = true;
								}
								if (permission.permission === "change_thread") {
									group.objectPermissions.change = true;
								}
							}
						})
					}

				});
			});

		};

		vm.getMemberList = function () {
			usersService.getMemberList().then(function (data) {

				vm.members = data.results;

				vm.members.forEach(function (member) {

					if (vm.thread["user_object_permissions"]) {
						vm.thread["user_object_permissions"].forEach(function (permission) {

							if (permission.member == member.id) {
								if (!member.hasOwnProperty('objectPermissions')) {
									member.objectPermissions = {};
								}
								if (permission.permission === "manage_thread") {
									member.objectPermissions.manage = true;
								}
								if (permission.permission === "change_thread") {
									member.objectPermissions.change = true;
								}
							}
						})
					}

				});

				vm.readyStatus.permissions = true;

				$scope.$apply();
			});
		};

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {

			console.log('tags to send', typeof vm.threadTags, [vm.threadTags]);

			vm.thread["group_object_permissions"] = [];
			vm.groups.map(function (group) {


				if (group.objectPermissions && group.objectPermissions.manage == true) {
					vm.thread["group_object_permissions"].push({
						"group": group.id,
						"permission": "manage_thread"
					})
				}

				if (group.objectPermissions && group.objectPermissions.change == true) {
					vm.thread["group_object_permissions"].push({
						"group": group.id,
						"permission": "change_thread"
					})
				}

			});

			vm.thread["user_object_permissions"] = [];
			vm.members.map(function (member) {


				if (member.objectPermissions && member.objectPermissions.manage == true) {
					vm.thread["user_object_permissions"].push({
						"member": member.id,
						"permission": "manage_thread"
					})
				}

				if (member.objectPermissions && member.objectPermissions.change == true) {
					vm.thread["user_object_permissions"].push({
						"member": member.id,
						"permission": "change_thread"
					})
				}

			});

			$mdDialog.hide({status: 'agree', data: {name: vm.threadName, tags: vm.threadTags, groups_permissions: vm.thread["group_object_permissions"], users_permissions: vm.thread["user_object_permissions"]}});
		};

		vm.getGroupList();
		vm.getMemberList();

	}
}());