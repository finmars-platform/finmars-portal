/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/actions-block-view.html',
            link: function (scope, elem, attrs) {


                scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType);
                scope.currentAdditions = scope.evDataService.getAdditions();

                scope.openViewConstructor = function (ev) {

                    if (scope.isReport) {

                        var controllerName = '';
                        var templateUrl = '';

                        console.log('scope.openModalSettings.entityType', scope.entityType);

                        switch (scope.entityType) {
                            case 'balance-report':
                                controllerName = 'gModalReportController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'pnl-report':
                                controllerName = 'gModalReportPnlController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'performance-report':
                                controllerName = 'gModalReportPerformanceController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-performance-view.html';
                                break;
                            case 'cash-flow-projection-report':
                                controllerName = 'gModalReportCashFlowProjectionController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-cash-flow-projection-view.html';
                                break;
                            case 'transaction-report':
                                controllerName = 'gModalReportTransactionController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-transaction-view.html';
                                break;
                        }

                        $mdDialog.show({
                            controller: controllerName,
                            templateUrl: templateUrl,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService
                            }
                        });


                    } else {
                        $mdDialog.show({
                            controller: 'gModalController as vm', // ../directives/gTable/gModalComponents
                            templateUrl: 'views/directives/groupTable/modal-view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService
                            }
                        });
                    }
                };

                scope.addEntity = function (ev) {

                    $mdDialog.show({
                        controller: 'EntityViewerAddDialogController as vm',
                        templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            entityType: scope.entityType
                        }
                    }).then(function () {

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                    })

                };

                scope.openActions = function ($mdOpenMenu, $event) {

                    scope.currentAdditions = scope.evDataService.getAdditions();

                    if (!Object.keys(scope.currentAdditions).length) {

                        clearAdditions();

                        scope.currentAdditions = scope.evDataService.getAdditions();
                    }

                    $mdOpenMenu($event);

                };

                function clearAdditions() {

                    var additions = {
                        additionsState: false,
                        reportWizard: false,
                        editor: false,
                        permissionEditor: false
                    };

                    scope.evDataService.setAdditions(additions);
                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                }

                scope.openDataViewPanel = function () {

                    if (scope.currentAdditions.reportWizard === false) {

                        var additions = {
                            additionsState: true,
                            reportWizard: true,
                            editor: false,
                            permissionEditor: false
                        };

                        scope.evDataService.setAdditions(additions);
                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                    } else {

                        clearAdditions();

                    }

                };

                scope.openPermissionEditor = function () {

                    console.log('scope.currentAdditions', scope.currentAdditions);

                    if (scope.currentAdditions.permissionEditor === false) {

                        var additions = {
                            additionsState: true,
                            reportWizard: false,
                            editor: false,
                            permissionEditor: true
                        };

                        scope.evDataService.setAdditions(additions);
                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                    } else {

                        clearAdditions();

                    }

                };

                scope.openEditorViewPanel = function () {

                    if (scope.currentAdditions.editor === false) {

                        var additions = {
                            additionsState: true,
                            reportWizard: false,
                            editor: true,
                            permissionEditor: false
                        };

                        scope.evDataService.setAdditions(additions);
                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                    } else {

                        clearAdditions();

                    }


                };


            }
        }
    }

}());