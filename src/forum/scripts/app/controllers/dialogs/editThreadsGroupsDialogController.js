(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var tagService = require('../../../../../portal/scripts/app/services/tagService');
	
	module.exports = function ($scope, $mdDialog, threadsGroupName) {
		var vm = this;	

		vm.groupName = threadsGroupName;
		if (threadsGroupName && threadsGroupName.length) {
			vm.threadsGroupName = threadsGroupName;
		}

		vm.tags = [];
		vm.getTagsList = function () {
			tagService.getListByContentType("thread-group", "tag").then(function (data) {
				vm.tags = data.results;
				console.log('forum group tags is', vm.tags, data);
				$scope.$apply();
			});
		};

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {tags: vm.threadsGroupsTags, name: vm.threadsGroupName}});
		};

		vm.getTagsList();	
	}
}());