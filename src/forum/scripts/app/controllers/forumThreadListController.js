/**
 * Created by sergey on 30.07.16.
 */
(function(){

	'use strict';

	var logService = require('../../../../core/services/logService');
	var threadService = require('../services/threadService');
	var threadGroupService = require('../services/threadGroupService');
	var tagService = require('../../../../portal/scripts/app/services/tagService');

	module.exports = function($scope, $stateParams, $mdDialog) {

		logService.controller('ForumThreadListController', 'initialized');

		var vm = this;

		vm.threadPageCurrent = 1;
		vm.itemPerPage = 20;

		vm.threadGroupId = $stateParams.groupId;
		console.log($stateParams, $scope);

		vm.threadGroupName = '';

		vm.readyStatus = {content: false};

		vm.getList = function(){
			var options = {page:vm.threadPageCurrent, threadGroup: vm.threadGroupId};
			threadService.getList(options).then(function(data){
				console.log(data, data.results);
				vm.threadMessagesTotal = data.count;
				vm.threads = data.results;
				vm.readyStatus.content = true;
				$scope.$apply();

			});
		};
		vm.getThreadGroupName = function () {
			threadGroupService.getByKey(vm.threadGroupId).then(function (data) {
				vm.threadGroupName = data.name;
				$scope.$apply();
			});
		};
		vm.createThredsList = function (ev) {
			$mdDialog.show({
				controller: 'ForumThreadListDialogController as vm',
				templateUrl: 'views/forum-thread-list-dialog-view.html',
				targetEvent: ev
			}).then(function (res) {
				if (res.status === 'agree') {
					// console.log(res, res.data);
					threadService.create({subject: res.data.threadListTitle, thread_group: vm.threadGroupId}).then(function () {
						console.log('Thread list created');
						vm.getList();
					})
				}
			});
		};

		vm.editThreadDialog = function (ev, threadId, threadSubject) {
			$mdDialog.show({
				controller: 'EditThreadDialogController as vm',
				templateUrl: 'views/dialogs/edit-thread-dialog-view.html',
				targetEvent: ev,
				locals: {
					threadName: threadSubject
				}
			}).then(function (data) {
				var threadTags = [];
				if (!isNaN(data.data.tags) && data.data.tags.length > 0) {
					threadTags = [parseInt(data.data.tags)];
				}
				var threadName = data.data.name;
				console.log('tags selected', threadTags, threadId);
				threadService.update(threadId, {subject: threadName, tags: threadTags, thread_group: vm.threadGroupId}).then(function () {
					console.log("thread's tags updated");
					vm.getList();
				});
			});
		}

		vm.getList();
		vm.getThreadGroupName();

	}

}());