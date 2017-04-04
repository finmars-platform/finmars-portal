/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var threadMessagesService = require('../services/threadMessagesService');
    var threadService = require('../services/threadService');

    module.exports = function ($scope, $stateParams, $mdDialog) {

        logService.controller('ForumThreadGroupListController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};

        vm.threadId = $stateParams.threadId;
        vm.threadGroupId = $stateParams.groupId;
        vm.threadPageCurrent = 1;
        vm.itemPerPage = 20;

        threadService.getByKey(vm.threadId).then(function (data) {
            vm.thread = data;
            $scope.$apply();
        });

        vm.getList = function (params) {

            vm.readyStatus.content = false;

            console.log('vm.threadPageCurrent', vm.threadPageCurrent, $stateParams);

            if (params && params.position == 'last-page') {
                if (vm.threadMessagesTotal % vm.itemPerPage !== 0) {
                    vm.threadPageCurrent = Math.round(vm.threadMessagesTotal / vm.itemPerPage) + 1;
                } else {
                    vm.threadPageCurrent = Math.round(vm.threadMessagesTotal / vm.itemPerPage);
                }
            }

            if (vm.threadPageCurrent === 0) {
                vm.threadPageCurrent = 1;
            }
            var options = {page: vm.threadPageCurrent, thread: vm.threadId};

            console.log('OPTIONS', options);
            console.log('params', params);

            // threadMessagesService.getList(options).then(function (data) {
            // 	console.log('get message list full data', data);

            // 	vm.messages = data.results.map(function(item){
            // 		var messageText = JSON.parse(item.text);
            // 		if (typeof messageText === 'object') {
            // 			messageText.message =  messageText.message.replace(/(\r\n|\n|\r)/gm, "<br />");
            // 			item.text = messageText;
            // 		}
            // 		else {
            // 			item.text = item.text.replace(/(\r\n|\n|\r)/gm, "<br />");
            // 		}
            // 		console.log('message content is', some);
            // 		return item;
            // 	});
            // 	console.log(data.results);
            // 	vm.threadMessagesTotal = data.count;
            // 	vm.readyStatus.content = true;
            // 	$scope.$apply();

            // });

            threadMessagesService.getList(options).then(function (data) {

                vm.messages = data.results.map(function (item) {

                    if (item.text[0] == "{") {
                        item.text = JSON.parse(item.text);
                    }

                    return item;
                });
                console.log(data.results);
                vm.threadMessagesTotal = data.count;
                vm.readyStatus.content = true;
                $scope.$apply();

            });

        };

        vm.changePage = function (page) {
            console.log('PAGE', page);
            vm.threadPageCurrent = page;
            vm.getList();
        };

        vm.replyToMessage = function (event, item) {
            var options = {
                quote: {
                    item: item
                }
            };
            vm.write(event, options);
        };

        vm.write = function (ev, options) {
            var quote;
            if (options && options.hasOwnProperty('quote')) {
                quote = options.quote;
            }
            $mdDialog.show({
                controller: 'ForumWriteMessageDialogController as vm',
                templateUrl: 'views/forum-message-dialog-view.html',
                locals: {
                    options: {
                        quote: quote
                    }
                },
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (res) {
                if (res.status === 'agree') {
                    threadMessagesService.create({
                        thread: vm.threadId,
                        text: JSON.stringify(res.data.message)
                    }).then(function () {
                        //console.log('Message created!');
                        vm.getList({position: 'last-page'});
                    })
                }
            });
        };

        vm.getList();

    }

}());