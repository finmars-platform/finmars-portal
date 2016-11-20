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

    module.exports = function ($scope) {

        logService.controller('AccrualCalculationSchedulesController', 'initialized');

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;

        vm.readyStatus = {notificationClasses: false, eventClasses: false};

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

        vm.checkReadyStatus = function () {
            return vm.readyStatus.notificationClasses && vm.readyStatus.eventClasses;
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
            vm.periodicityItems.forEach(function (item) {
                if (row.periodicity == item.id) {
                    row.periodicity_name = item.name;
                    name = item.name
                }
            });
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
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.event_schedules.splice(index, 1);
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