(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var tagService = require('../../../../../portal/scripts/app/services/tagService');
	
	module.exports = function ($scope, $mdDialog, threadName) {
		var vm = this;	

		console.log('dialog thread name is', threadName);
		vm.threadName = threadName;

		vm.tags = [];
		vm.getTagsList = function () {
			tagService.getListByContentType("thread", "tag").then(function (data) {
				vm.tags = data.results;
				console.log('forum tags is', vm.tags, data);
				$scope.$apply();
			});
		};

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {name: vm.threadName, tags: vm.threadTags}});
		};

		vm.getTagsList();
	}
}());