/**
 * Created by sergey on 30.07.16.
 */
(function(){

	'use strict';

	var logService = require('../../../../core/services/logService');
	var threadGroupService = require('../services/threadGroupService');
	var tagService = require('../../../../portal/scripts/app/services/tagService');
	
	module.exports = function($scope, $mdDialog) {

		logService.controller('ForumThreadGroupListController', 'initialized');

		var vm = this;

		vm.readyStatus = {content: false};

		vm.getList = function(){
			threadGroupService.getList({page: 1}).then(function(data){
				console.log('threadGroup items', data.results);
				vm.threadGroups = data.results;
				vm.threadGroups.forEach(function (group) {
					group.filterTag = group.tags[0];
				});
				vm.readyStatus.content = true;
				console.log('thread groups tags', vm.threadGroups);
				$scope.$apply();
			});
		};

		vm.createThredsGroup = function (ev) {
			$mdDialog.show({
				controller: 'ForumThreadGroupDialogController as vm',
				templateUrl: 'views/forum-thread-group-dialog-view.html',
				targetEvent: ev
			}).then(function (res) {
				if (res.status === 'agree') {
					console.log(res, res.data);
					threadGroupService.create({name: res.data.threadGroupTitle}).then(function () {
						console.log('Threads group created');
						vm.getList();
					})
				}
			});
		};

		vm.editThreadsGroupsDialog = function (ev, threadsGroupId) {
			$mdDialog.show({
				controller: 'EditThreadsGroupsDialogController as vm',
				templateUrl: 'views/dialogs/edit-threads-groups-dialog-view.html',
				targetEvent: ev,
				locals: {
					threadsGroupId: threadsGroupId
				}
			}).then(function (data) {
				var threadsGroupTags = [];
				var parsedGroupTags = parseInt(data.data.tags);

				if (parsedGroupTags !== 'NaN') {
					if (typeof data.data.tags === 'string') {
						threadsGroupTags = [parsedGroupTags];
					}
					else {
						threadsGroupTags = [data.data.tags];
					}
				}
				var threadsGroupName = data.data.name;
				threadGroupService.update(threadsGroupId, {name: threadsGroupName, tags: threadsGroupTags}).then(function () {
					console.log("thread's tags updated");
					vm.getList();
				});
			});
		}

		vm.getTagList = function () {
			tagService.getListByContentType("thread-group", "tag").then(function (data) {
				vm.tags = data.results;
				$scope.$apply();
			});
		}

		vm.deleteThreadsGroup = function (id) {
			threadGroupService.deleteByKey(id).then(function () {
				vm.getList();
			});
		}

		vm.getTagList();
		vm.getList();

	}

}());