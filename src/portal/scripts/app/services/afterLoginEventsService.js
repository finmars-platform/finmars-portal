/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var eventsService = require('./eventsService');

    var openDoNotReactDialog = function ($event, item) {

        return $mdDialog.show({
            controller: 'EventDoNotReactDialogController as vm',
            templateUrl: 'views/dialogs/events/event-do-not-react-dialog-view.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: {
                    event: item
                }
            },
            preserveScope: true,
            autoWrap: true,
            skipHide: true,
            multiple: true
        })

    };

    var openApplyDefaultDialog = function ($event, item) {

        return $mdDialog.show({
            controller: 'EventApplyDefaultDialogController as vm',
            templateUrl: 'views/dialogs/events/event-apply-default-dialog-view.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: {
                    event: item
                }
            },
            preserveScope: true,
            autoWrap: true,
            skipHide: true,
            multiple: true
        })

    };

    var openWithReactDialog = function ($event, item) {
        return $mdDialog.show({
            controller: 'EventWithReactDialogController as vm',
            templateUrl: 'views/dialogs/events/event-with-react-dialog-view.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: {
                    event: item
                }
            },
            preserveScope: true,
            autoWrap: true,
            skipHide: true,
            multiple: true
        })
    };

    var recursiveOpenDialogs = function (resolve, events, index, $event) {

        var doNotReactActionsIds = [6, 9, 14];
        var withReactActionsIds = [4, 7, 10, 11];
        var applyDefaultActionsIds = [5, 8, 12, 13];

        var event = events[index];

        if (event && event.status === 1 && event.event_schedule_object) {

            var notification_class = event.event_schedule_object.notification_class;

            if (withReactActionsIds.indexOf(notification_class) !== -1) {

                vm.openWithReactDialog($event, event).then(function (value) {

                    index = index + 1;
                    if (events.length < index) {
                        vm.recursiveOpenDialogs(resolve, events, index, $event);
                    } else {
                        resolve();
                    }

                })

            }

            if (doNotReactActionsIds.indexOf(notification_class) !== -1) {

                vm.openDoNotReactDialog($event, event).then(function (value) {

                    index = index + 1;
                    if (events.length < index) {
                        vm.recursiveOpenDialogs(resolve, events, index, $event);
                    } else {
                        resolve();
                    }

                })
            }

            if (applyDefaultActionsIds.indexOf(notification_class) !== -1) {

                vm.openApplyDefaultDialog($event, event).then(function (value) {

                    index = index + 1;
                    if (events.length < index) {
                        vm.recursiveOpenDialogs(resolve, events, index, $event);
                    } else {
                        resolve();
                    }

                })
            }

        } else {

            index = index + 1;
            if (events.length < index) {
                vm.recursiveOpenDialogs(resolve, events, index, $event);
            } else {
                resolve();
            }

        }

    };

    var showEvents = function ($mdDialog, events) {

        // DONT_REACT = 1
        // APPLY_DEF_ON_EDATE = 2
        // APPLY_DEF_ON_NDATE = 3
        //
        // INFORM_ON_NDATE_WITH_REACT = 4
        // INFORM_ON_NDATE_APPLY_DEF = 5
        // INFORM_ON_NDATE_DONT_REACT = 6
        // INFORM_ON_EDATE_WITH_REACT = 7
        // INFORM_ON_EDATE_APPLY_DEF = 8
        // INFORM_ON_EDATE_DONT_REACT = 9
        //
        // INFORM_ON_NDATE_AND_EDATE_WITH_REACT_ON_EDATE = 10
        // INFORM_ON_NDATE_AND_EDATE_WITH_REACT_ON_NDATE = 11
        // INFORM_ON_NDATE_AND_EDATE_APPLY_DEF_ON_EDATE = 12
        // INFORM_ON_NDATE_AND_EDATE_APPLY_DEF_ON_NDATE = 13
        // INFORM_ON_NDATE_AND_EDATE_DONT_REACT = 14

        var notificationDateIds = [4, 5, 6, 10, 11, 12, 13, 14];
        var effectiveDateIds = [7, 8, 9, 10, 11, 12, 13, 14];

        var newEvents = events.filter(function (event) {
            return event.status === 1
        });

        var notificationDateEvents = newEvents.filter(function (event) {
            return notificationDateIds.indexOf(event.event_schedule_object.notification_class) !== -1;
        });

        var effectiveDateEvents = newEvents.filter(function (event) {
            return effectiveDateIds.indexOf(event.event_schedule_object.notification_class) !== -1;
        });

        var $event = new Event('click');

        var index = 0;

        new Promise(function (resolve) {

            if (notificationDateEvents.length) {
                recursiveOpenDialogs(resolve, notificationDateEvents, index, $event)
            } else {
                resolve();
            }

        }).then(function () {

            new Promise(function (resolve) {

                if (effectiveDateEvents.length) {
                    index = 0;
                    recursiveOpenDialogs(resolve, effectiveDateEvents, index, $event)
                } else {
                    resolve();
                }

            })

        });

    };

    var getAndShowEvents = function ($mdDialog) {

        var effective_date_from = moment(new Date()).format('YYYY-MM-DD');
        var effective_date_to = moment(new Date()).format('YYYY-MM-DD');

        console.log('showing events here');

        var options = {};

        options.filters = {};
        options.filters.effective_date_0 = effective_date_from;
        options.filters.effective_date_1 = effective_date_to;

        eventsService.getList(options).then(function (data) {

            var events = data.results;

            if (events.length) {

                showEvents($mdDialog, events);

            }


        })

    };

    module.exports = {
        getAndShowEvents: getAndShowEvents,
        showEvents: showEvents,
        openDoNotReactDialog: openDoNotReactDialog,
        openApplyDefaultDialog: openApplyDefaultDialog,
        openWithReactDialog: openWithReactDialog
    }


}());