/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    //var instrumentEventScheduleService = require('../../services/instrument/instrumentEventScheduleService');
    var metaNotificationClassService = require('../../../services/metaNotificationClassService');
    var metaEventClassService = require('../../../services/metaEventClassService');
    var instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');
    var instrumentEventScheduleService = require('../../../services/instrument/instrumentEventScheduleService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('eventSchedulesTabController', 'initialized');

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;
        vm.entityType = 'instrument';
        vm.entityAttrs = $scope.$parent.vm.entityAttrs;

        var activeItemOriginal = null;

        vm.readyStatus = {notificationClasses: false, eventClasses: false, eventSchedulesReady: false};

        metaNotificationClassService.getList().then(function (data) {
            vm.notificationClasses = data;
            vm.readyStatus.notificationClasses = true;
            $scope.$apply();
        });

        metaEventClassService.getList().then(function (data) {
            vm.eventClasses = data;
            vm.readyStatus.eventClasses = true;
            $scope.$apply();
        });

        instrumentPeriodicityService.getList().then(function (data) {
            vm.periodicityItems = data;
            vm.readyStatus.periodicityItems = true;
            $scope.$apply();
        });

        if (vm.entity.event_schedules) {
            vm.readyStatus.eventSchedulesReady = true;
        }

        var getAttributeByKey = function (key) {

            for (var i = 0; i < vm.entityAttrs.length; i++) {

                if (vm.entityAttrs[i].key === key) {
                    return vm.entityAttrs[i];
                }

            }

        };

        vm.maturityDateAttr = getAttributeByKey('maturity_date');
        vm.maturityPriceAttr = getAttributeByKey('maturity_price');

        vm.checkReadyStatus = function () {
            return vm.readyStatus.notificationClasses && vm.readyStatus.eventClasses && vm.readyStatus.eventSchedulesReady;
        };

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.bindNotificationClass = function (row) {
            var name;
            vm.notificationClasses.forEach(function (item) {
                if (row.notification_class == item.id) {
                    row.notification_class_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.bindEventClass = function (row) {
            var name;
            vm.eventClasses.forEach(function (item) {
                if (row.event_class == item.id) {
                    row.event_class_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.bindPeriodicity = function (row) {
            var name;
            if (vm.periodicityItems) {
                vm.periodicityItems.forEach(function (item) {
                    if (row.periodicity == item.id) {
                        row.periodicity_name = item.name;
                        name = item.name
                    }
                });
            }

            return name;
        };

        vm.newItem = {
            "name": '',
            "description": "",
            "notification_class": '',
            "notify_in_n_days": '',
            "periodicity": '',
            "periodicity_n": '',
            "action_is_sent_to_pending": null,
            "action_is_book_automatic": null,
            "actions": [],
            "effective_date": null,
            "final_date": null,
            "event_class": null
        };

        vm.editItem = function (item) {
            item.editStatus = true;

            activeItemOriginal = JSON.stringify(item)
        };

        vm.saveItem = function (item) {

            if (activeItemOriginal !== JSON.stringify(item)) {
                item.is_auto_generated = false;
            }

            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.event_schedules.splice(index, 1);
        };

        vm.createActions = function ($event, actions) {
            $mdDialog.show({
                controller: 'InstrumentEventActionsDialogController as vm',
                templateUrl: 'views/dialogs/instrument-event-actions-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                clickOutsideToClose: false,
                locals: {
                    eventActions: actions
                }
            });
        };

        vm.generateEventsSchedule = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'All changes will be saved, OK?'
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.readyStatus.eventSchedulesReady = false;
                    $scope.$parent.vm.updateItem().then(function (value) {

                        instrumentEventScheduleService.rebuildEvents(vm.entity.id, vm.entity).then(function (data) {

                            console.log('events rebuilt data', data);

                            $scope.$parent.vm.getItem().then(function (getItemData) {
                                vm.entity = $scope.$parent.vm.entity;
                                vm.readyStatus.eventSchedulesReady = true;
                            });

                        })

                    })
                }

            });

        };

        vm.addRow = function () {
            vm.entity.event_schedules.push({
                "name": vm.newItem.name,
                "description": vm.newItem.description,
                "notification_class": vm.newItem.notification_class,
                "notify_in_n_days": vm.newItem.notify_in_n_days,
                "action_text": vm.newItem.action_text,
                "event_class": vm.newItem.event_class,
                "action_is_sent_to_pending": vm.newItem.action_is_sent_to_pending,
                "action_is_book_automatic": vm.newItem.action_is_book_automatic,
                "actions": vm.newItem.actions,
                "effective_date": vm.newItem.effective_date,
                "final_date": vm.newItem.final_date,
                "periodicity": vm.newItem.periodicity,
                "periodicity_n": vm.newItem.periodicity_n
            });

            vm.newItem = {
                "name": '',
                "description": "",
                "notification_class": '',
                "notify_in_n_days": '',
                "periodicity": '',
                "periodicity_n": '',
                "action_is_sent_to_pending": null,
                "action_is_book_automatic": null,
                "actions": [],
                "effective_date": null,
                "final_date": null,
                "event_class": null
            };
        }

    }

}());