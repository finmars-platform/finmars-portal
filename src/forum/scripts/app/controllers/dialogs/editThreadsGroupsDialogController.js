(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var threadGroupService = require('../../services/threadGroupService');
	var threadService = require('../../services/threadService');
	var tagService = require('../../../../../portal/scripts/app/services/tagService');

	var usersService = require('../../../../../portal/scripts/app/services/usersService');
	var usersGroupService = require('../../../../../portal/scripts/app/services/usersGroupService');

	module.exports = function ($scope, $mdDialog, threadsGroupId) {
		var vm = this;	

		console.log('threadsGroupId is', threadsGroupId);
		vm.tags = [];
		tagService.getListByContentType("thread-group", "tag").then(function (data) {
			vm.tags = data.results;
			console.log('forum group tags is', vm.tags, data);
			$scope.$apply();
		});

		vm.threadGroup = [];
		vm.loadThreadGroups = function () {
			return threadGroupService.getByKey(threadsGroupId).then(function(data) {
				vm.threadGroup = data;
				if (vm.threadGroup.name && vm.threadGroup.name.length) {
					vm.threadsGroupName = vm.threadGroup.name;
				}
				if (vm.threadGroup.tags && vm.threadGroup.tags.length) {
					vm.threadsGroupTags = vm.threadGroup.tags[0];
				}
			});
		}

		vm.loadThreadList = function () {
			return threadService.getList({threadGroup: threadsGroupId}).then(function(data) {
				vm.threadList = data.results;
				console.log('thread list is', vm.threadList);
				vm.loadPermissions();
			});
		}

		vm.loadAllThreads = function() {
			var promises = [];

			promises.push(vm.loadThreadGroups());
			promises.push(vm.loadThreadList());

			Promise.all(promises).then(function (data) {

				// vm.readyStatus.permissions = true;
				$scope.$apply();
			});
		}

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

				//console.log('data MEMBERS', data);

				vm.groups = data.results;

				vm.groups.forEach(function (group) {

					if (vm.threadList["group_object_permissions"]) {
						vm.threadList["group_object_permissions"].forEach(function (permission) {

							if (permission.group == group.id) {
								if (!group.hasOwnProperty('objectPermissions')) {
									group.objectPermissions = {};
								}
								if (permission.permission === "manage_thread_list") {
									group.objectPermissions.manage = true;
								}
								if (permission.permission === "change_thread_list") {
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

				//console.log('data MEMBERS', data);

				vm.members = data.results;

				vm.members.forEach(function (member) {

					if (vm.threadList["user_object_permissions"]) {
						vm.threadList["user_object_permissions"].forEach(function (permission) {

							if (permission.member == member.id) {
								if (!member.hasOwnProperty('objectPermissions')) {
									member.objectPermissions = {};
								}
								if (permission.permission === "manage_thread_list") {
									member.objectPermissions.manage = true;
								}
								if (permission.permission === "change_thread_list") {
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

			vm.threadList["group_object_permissions"] = [];
			
			vm.groups.map(function (group) {

				if (group.objectPermissions && group.objectPermissions.manage == true) {
					vm.threadList["group_object_permissions"].push({
						"group": group.id,
						"permission": "manage_thread_list"
					})
				}

				if (group.objectPermissions && group.objectPermissions.change == true) {
					vm.threadList["group_object_permissions"].push({
						"group": group.id,
						"permission": "change_thread_list"
					})
				}

			});

			vm.threadList["user_object_permissions"] = [];

			vm.members.map(function (member) {

				if (member.objectPermissions && member.objectPermissions.manage == true) {
					vm.threadList["user_object_permissions"].push({
						"member": member.id,
						"permission": "manage_thread_list"
					})
				}

				if (member.objectPermissions && member.objectPermissions.change == true) {
					vm.threadList["user_object_permissions"].push({
						"member": member.id,
						"permission": "change_thread_list"
					})
				}

			});

			$mdDialog.hide({status: 'agree', data: {tags: vm.threadsGroupTags, name: vm.threadsGroupName, groups_permissions: vm.threadList["group_object_permissions"], users_permissions: vm.threadList["user_object_permissions"]}});
		};

		vm.loadAllThreads();
	
	}
}());