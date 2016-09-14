/**
 * Created by sergey on 30.07.16.
 */
(function(){

	'use strict';

	var logService = require('../../../../core/services/logService');
	var threadGroupService = require('../services/threadGroupService');

	module.exports = function($scope, $mdDialog) {

		logService.controller('ForumThreadGroupListController', 'initialized');

		var vm = this;

		vm.readyStatus = {content: false};

		vm.getList = function(){
			threadGroupService.getList({page: 1}).then(function(data){
				console.log('threadGroup items', data.results);
				vm.threadGroups = data.results;
				vm.readyStatus.content = true;
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

		vm.editThreadsGroupsDialog = function (ev, threadGroupId, threadGroupName) {
			console.log('init group name', threadGroupName);
			$mdDialog.show({
				controller: 'EditThreadsGroupsDialogController as vm',
				templateUrl: 'views/dialogs/edit-threads-groups-dialog-view.html',
				targetEvent: ev,
				locals: {
					threadsGroupName: threadGroupName
				}
			}).then(function (data) {
				var threadsGroupTags = [];
				if (!isNaN(data.data.tags) && data.data.tags.length > 0) {
					threadsGroupTags = [parseInt(data.data.tags)];
				}
				var threadsGroupName = data.data.name;
				threadGroupService.update(threadGroupId, {name: threadsGroupName, tags: threadsGroupTags}).then(function () {
					console.log("thread's tags updated");
					vm.getList();
				});
			});
		}

		vm.getList();

	}

}());