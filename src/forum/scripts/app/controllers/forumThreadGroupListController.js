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

		vm.getList();

	}

}());