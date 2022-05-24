(function () {

    var instrumentEventRepository = require('../repositories/instrumentEventRepository');

    var getList = function (options) {
        return instrumentEventRepository.getList(options);
    };

	var getByKey = function (id) {
		return instrumentEventRepository.getByKey(id);
	};

    var getEventAction = function (eventId, actionId) {
        return instrumentEventRepository.getEventAction(eventId, actionId);
    };

    var putEventAction = function (eventId, actionId, data, status) {
        return instrumentEventRepository.putEventAction(eventId, actionId, data, status);
    };

    var informedEventAction = function (id) {
        return instrumentEventRepository.informedEventAction(id);
    };

    var errorEventAction = function (id, actionId, data) {
        return instrumentEventRepository.errorEventAction(id, actionId, data);
    };

    var generateEvents = function () {
        return instrumentEventRepository.generateEvents();
    };

    var generateEventsRange = function (options) {
        return instrumentEventRepository.generateEventsRange(options);
    };

    var generateAndProcessAsSystem = function () {
        return instrumentEventRepository.generateAndProcessAsSystem();
    };

    var generateEventsRangeForSingleInstrument = function (options) {
        return instrumentEventRepository.generateEventsRangeForSingleInstrument(options);
    };

	var openDoNotReactDialog = function ($mdDialog, item, $event) {

		var dialogData = {
			controller: 'EventDoNotReactDialogController as vm',
			templateUrl: 'views/dialogs/events/event-do-not-react-dialog-view.html',
			parent: angular.element(document.body),
			locals: {
				data: {
					event: item,
					skipAllButton: false
				}
			},
			multiple: true
		}

		if ($event) {
			dialogData.targetEvent = $event;
		}

		return $mdDialog.show(dialogData);

	};

	var openApplyDefaultDialog = function ($mdDialog, item, $event) {

		var dialogData = {
			controller: 'EventApplyDefaultDialogController as vm',
			templateUrl: 'views/dialogs/events/event-apply-default-dialog-view.html',
			parent: angular.element(document.body),
			locals: {
				data: {
					event: item,
					skipAllButton: false
				}
			},
			multiple: true
		}

		if ($event) {
			dialogData.targetEvent = $event;
		}

		return $mdDialog.show(dialogData);

	};

	var openWithReactDialog = function ($mdDialog, event, $event) {

		var dialogData = {
			controller: 'EventWithReactDialogController as vm',
			templateUrl: 'views/dialogs/events/event-with-react-dialog-view.html',
			parent: angular.element(document.body),
			locals: {
				data: {
					event: event,
					skipAllButton: false
				}
			},
			multiple: true
		}

		if ($event) {
			dialogData.targetEvent = $event;
		}

		return $mdDialog.show(dialogData);
	};

	/*
	Notification classes

	DONT_REACT = 1
	APPLY_DEF_ON_EDATE = 2
	APPLY_DEF_ON_NDATE = 3

	INFORM_ON_NDATE_WITH_REACT = 4
	INFORM_ON_NDATE_APPLY_DEF = 5
	INFORM_ON_NDATE_DONT_REACT = 6
	INFORM_ON_EDATE_WITH_REACT = 7
	INFORM_ON_EDATE_APPLY_DEF = 8
	INFORM_ON_EDATE_DONT_REACT = 9

	INFORM_ON_NDATE_AND_EDATE_WITH_REACT_ON_EDATE = 10
	INFORM_ON_NDATE_AND_EDATE_WITH_REACT_ON_NDATE = 11
	INFORM_ON_NDATE_AND_EDATE_APPLY_DEF_ON_EDATE = 12
	INFORM_ON_NDATE_AND_EDATE_APPLY_DEF_ON_NDATE = 13
	INFORM_ON_NDATE_AND_EDATE_DONT_REACT = 14
	*/

	var withReactActionsIds = [4, 7, 10, 11];
	var doNotReactActionsIds = [6, 9, 14];
	var applyDefaultActionsIds = [5, 8, 12, 13];

	var processEvent = function ($mdDialog, event, $event) {

		return new Promise(function (resolve) {

			if (event.event_schedule_object) {

				var notification_class = event.event_schedule_object.notification_class;

				 if (withReactActionsIds.indexOf(notification_class) !== -1) {

					openWithReactDialog($mdDialog, event, $event).then(function (data) {
						resolve(data);
					});

				}
				if (doNotReactActionsIds.indexOf(notification_class) !== -1) {

					openDoNotReactDialog($mdDialog, event, $event).then(function (data) {
						resolve(data);
					});
				}
				else if (applyDefaultActionsIds.indexOf(notification_class) !== -1) {

					openApplyDefaultDialog($mdDialog, event, $event).then(function (data) {
						resolve(data);
					});

				} else {
					resolve();
				}

			} else {
				resolve();
			}

		});

	};

	var eventStatuses = {
		1: 'New',
		2: 'Ignored',
		3: 'Booked (system, default)',
		4: 'Booked (user, actions)',
		5: 'Booked (user, default)',
		6: 'Booked, pending (system, default)',
		7: 'Booked, pending (user, actions)',
		8: 'Booked, pending (user, default)',
		9: 'Error',
	};

	var getEventStatuses = function () {
		return Object.assign({}, eventStatuses);
	};

	module.exports = {
        getList: getList,
		getByKey: getByKey,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        informedEventAction: informedEventAction,
        errorEventAction: errorEventAction,
        generateEvents: generateEvents,
        generateEventsRange: generateEventsRange,
        generateAndProcessAsSystem: generateAndProcessAsSystem,
        generateEventsRangeForSingleInstrument: generateEventsRangeForSingleInstrument,

		processEvent: processEvent,

		getEventStatuses: getEventStatuses
    }


}());