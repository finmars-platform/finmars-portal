(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var threadGroupService = require('../../services/threadGroupService');
	var tagService = require('../../../../../portal/scripts/app/services/tagService');
	
	module.exports = function ($scope, $mdDialog, threadsGroupId) {
		var vm = this;	

		console.log('threadsGroupId is', threadsGroupId);
		vm.tags = [];
		tagService.getListByContentType("thread-group", "tag").then(function (data) {
			vm.tags = data.results;
			console.log('forum group tags is', vm.tags, data);
			$scope.$apply();
		});
		threadGroupService.getByKey(threadsGroupId).then(function(data) {
			console.log('thredsGroup data', data);
			var threadGroup = data;
			if (threadGroup.name && threadGroup.name.length) {
				vm.threadsGroupName = threadGroup.name;
			}
			if (threadGroup.tags && threadGroup.tags.length) {
				vm.threadsGroupTags = threadGroup.tags[0];
			}
			$scope.$apply();
		});

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {tags: vm.threadsGroupTags, name: vm.threadsGroupName}});
		};
	
	}
}());