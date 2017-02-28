/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var eventsService = require('../services/eventsService');
    var uiService = require('../services/uiService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('DashboardController', 'initialized');

        var vm = this;

        vm.readyStatus = {uiLayouts: false};

        vm.getUiLayouts = function () {

            uiService.getListLayout('all').then(function (data) {

                vm.uiLayouts = data.results;

                vm.readyStatus.uiLayouts = true;

                $scope.$apply();

            });
        };

        vm.getUiLayouts();

        vm.widget1 = {
            entityType: 'balance-report',
            entityRaw: [],
            isReport: true,
            entityViewer: {extraFeatures: []},
            _d_configured: true,
            components: {
                sidebar: false,
                splitPanel: false,
                addEntityBtn: false,
                fieldManagerBtn: false
            }
        };

        vm.widget2 = {
            entityType: 'instrument',
            entityRaw: [],
            isReport: false,
            entityViewer: {extraFeatures: []},
            _d_configured: true,
            components: {
                sidebar: false,
                splitPanel: false,
                addEntityBtn: false,
                fieldManagerBtn: false
            }
        };

        vm.widget3 = {
            entityType: 'portfolio',
            entityRaw: [],
            isReport: false,
            entityViewer: {extraFeatures: []},
            _d_configured: true,
            components: {
                sidebar: false,
                splitPanel: false,
                addEntityBtn: false,
                fieldManagerBtn: false
            }
        };

        vm.widget4 = {
            entityType: 'account',
            entityRaw: [],
            isReport: false,
            entityViewer: {extraFeatures: []},
            _d_configured: true,
            components: {
                sidebar: false,
                splitPanel: false,
                addEntityBtn: false,
                fieldManagerBtn: false
            }
        };

        vm.resolveEntity = function (item) {
            return metaContentTypesService.findEntityByContentType(item.content_type, 'ui').split('-').join(' ').capitalizeFirstLetter();
        };

        vm.closeWidget = function (widget) {
            widget._d_configured = false;
            widget.uiLayoutId = null;
            widget.entityType = null;
            widget._d_layout = null;
            widget.isReport = false;
        };

        vm.changeWidget = function (widget) {
            widget.entityType = metaContentTypesService.findEntityByContentType(widget._d_layout.content_type, 'ui');
            widget.uiLayoutId = widget._d_layout.id;
            widget._d_configured = true;

            if (widget.entityType.indexOf('-report') !== -1) {
                widget.isReport = true;
            } else {
                widget.isReport = false;
            }


            console.log('widget', widget);

        };

        vm.checkForEvents = function (target) {
            eventsService.getList().then(function (data) {
                vm.eventsList = data.results;
                $scope.$apply();
                data.results.map(function (event) {
                    ;
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