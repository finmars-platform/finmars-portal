/**
 * Created by szhitenev on 14.06.2016.
 */
(function(){

	'use strict';

	var logService = require('../../../../../core/services/logService');

	var notificationsService = require('../../services/notificationsService');

	module.exports = function($scope){

		logService.controller('NotificationsController', 'initialized');

		var vm = this;

		vm.itemPerPage = 20;
		vm.notificationsReady = true;

		vm.changePage = function (page) {
			vm.notificationsCurrent = page;
			vm.getNotifications();
		}
		vm.getNotifications = function () {
			vm.notificationsCurrent = vm.notificationsCurrent || 1;
			vm.notificationsReady = false;

			notificationsService.getList(vm.notificationsCurrent).then(function(data){
				vm.notificationsTotal = data.count;
				vm.notifications = data.results;
				vm.notificationsReady = true;
				$scope.$apply();
			});
		}
		vm.getNotifications();

		vm.markCurrentNotificationsAsReaded = function (url, data) {
			notificationsService.markAsReaded(url, data).then(function() {
				$scope.$apply();
			})
		}
		vm.markAllNotificationsAsReaded	= function () {
			notificationsService.markAsReaded(data).then(function() {
				$scope.$apply();
			})
		}
	}

}());