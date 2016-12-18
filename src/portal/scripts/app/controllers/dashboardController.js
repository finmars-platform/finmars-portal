/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var eventsService = require('../services/eventsService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('DashboardController', 'initialized');
    
    	var vm = this;
    	
    	vm.eventsList = [];
        vm.checkForEvents = function (target) {
			eventsService.getList().then(function (data) {
				vm.eventsList = data.results;
				$scope.$apply();
				data.results.map(function(event) {;
					var eventActions = event.event_schedule_object['actions']; // button in event dialog
					vm.openEventWindow(target, event.id, eventActions);
				});
			});
		};

		vm.openEventWindow = function ($event, eventId, eventActions) {
			$mdDialog.show({
				controller: 'EventDialogController as vm',
				templateUrl: 'views/dialogs/event-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				locals: {
					data: {
						eventId: eventId,
						eventActions: eventActions
					}
				}
			})
		}
    }

}());