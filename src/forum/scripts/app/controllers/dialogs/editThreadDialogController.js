(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var tagService = require('../../../../../portal/scripts/app/services/tagService');
	var threadService = require('../../services/threadService');
	
	module.exports = function ($scope, $mdDialog, threadId) {
		var vm = this;

		vm.tags = [];
		tagService.getListByContentType("thread", "tag").then(function (data) {
			vm.tags = data.results;
			console.log('forum tags is', vm.tags, data);
			$scope.$apply();
		});

		threadService.getByKey(threadId).then(function(data) {
			vm.thread = data.results;
			vm.threadName = data.subject;
			vm.threadTags = data.tags[0];
			$scope.$apply();
		})

		vm.cancel = function () {
			$mdDialog.cancel();
		};

		vm.agree = function () {
			$mdDialog.hide({status: 'agree', data: {name: vm.threadName, tags: vm.threadTags}});
		};

	}
}());