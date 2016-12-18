(function() {
	'use strict';

	var logService = require('../../../../../core/services/logService');
	var eventsService = require('../../services/eventsService');

	module.exports = function ($scope, $mdDialog, data) {
		console.log('id for event buttons', data);

		var vm = this;

		vm.actionsBtns = data.eventActions;
		console.log('event button is', vm.actionsBtns);
		var eventId = data.eventId;

		vm.eventAction = function (actionId) {
			eventsService.eventAction(eventId, {action: actionId}).then(function () {
				console.log('event action done');
			});
		}
	}
}());