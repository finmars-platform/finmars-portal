/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');

        var stringHelper = require('../../helpers/stringHelper');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');

        var entityViewerReducer = require('./entityViewerReducer');

        module.exports = function ($scope, $mdDialog, $state, $transitions) {

            var vm = this;

            vm.listViewIsReady = false;

            var activeLayoutConfigString = {};
            var activeLayoutHash = '';

            var entityViewerDataService = new EntityViewerDataService();
            var entityViewerEventService = new EntityViewerEventService();

            vm.entityViewerDataService = entityViewerDataService;
            vm.entityViewerEventService = entityViewerEventService;

            vm.getView = function () {

                uiService.getActiveListLayout(vm.entityType).then(function (res) {

                    /*var listLayout = {};

                    if (res.results.length) {

                        listLayout = Object.assign({}, res.results[0]);

                    } else {

                        console.log('default triggered');

                        var defaultList = uiService.getDefaultListLayout();

                        listLayout = {};
                        listLayout.data = Object.assign({}, defaultList[0].data);

                    }

                    entityViewerDataService.setListLayout(listLayout);

                    entityViewerDataService.setColumns(listLayout.data.columns);
                    entityViewerDataService.setGroups(listLayout.data.grouping);
                    entityViewerDataService.setFilters(listLayout.data.filters);

                    listLayout.data.components = {
                        sidebar: true,
                        groupingArea: true,
                        columnAreaHeader: true,
                        splitPanel: true,
                        addEntityBtn: true,
                        fieldManagerBtn: true,
                        layoutManager: true,
                        autoReportRequest: false
                    };

                    entityViewerDataService.setComponents(listLayout.data.components);
                    entityViewerDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                    entityViewerDataService.setRootEntityViewer(true);*/

                    entityViewerDataService.setLayoutCurrentConfiguration(res, uiService, false);

                    vm.listViewIsReady = true;

                    console.log('vm', vm);

                    evDataProviderService.updateDataStructure(entityViewerDataService, entityViewerEventService);

                    $scope.$apply();

                    activeLayoutConfigString = JSON.stringify(entityViewerDataService.getListLayout());
                    activeLayoutHash = stringHelper.toHash(activeLayoutConfigString);
                });

            };

            vm.init = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                entityViewerDataService.setEntityType($scope.$parent.vm.entityType);

                vm.getView();

                entityViewerReducer.initReducer(entityViewerDataService, entityViewerEventService, $mdDialog, vm.getView);

            };

            vm.init();

            var listOfStatesWithLayout = [
                'app.data.portfolio',
                'app.data.account',
                'app.data.account-type',
                'app.data.counterparty',
                'app.data.responsible',
                'app.data.instrument',
                'app.data.instrument-type',
                'app.data.pricing-policy',
                'app.data.complex-transaction',
                'app.data.transaction',
                'app.data.transaction-type',
                'app.data.currency-history',
                'app.data.price-history',
                'app.data.currency',
                'app.data.strategy-group',
                'app.data.strategy'
            ];

            vm.stateWithLayout = false;

            if (listOfStatesWithLayout.indexOf($state.current.name) !== -1) {
                vm.stateWithLayout = true;
            }

            var checkLayoutForChanges = function (transition) {

                var stateName = transition.from().name;

                if (vm.stateWithLayout) {

                    var layoutCurrentConfigString = JSON.stringify(entityViewerDataService.getLayoutCurrentConfiguration(false));
                    var layoutCurrentConfigHash = stringHelper.toHash(layoutCurrentConfigString);

                    if (activeLayoutHash !== layoutCurrentConfigHash) {

                        return new Promise (function (resolve, reject) {

                            $mdDialog.show({
                                controller: 'LayoutChangesLossWarningDialogController as vm',
                                templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                                parent: angular.element(document.body),
                                preserveScope: true,
                                autoWrap: true,
                                multiple: true
                            }).then(function (res, rej) {

                                if (res.status === 'save_layout') {

                                    var layoutCurrentConfig = JSON.parse(layoutCurrentConfigString);

                                    if (layoutCurrentConfig.hasOwnProperty('id')) {

                                        uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                            resolve(true);
                                        });

                                    } else {

                                        uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                            resolve(true);
                                        });

                                    }

                                } else if ('do_not_save_layout') {

                                    resolve(true);

                                }

                            }).catch(function () {
                                reject(false);
                            });
                        });

                    }
                }

            };

            var doBeforeStateChange = $transitions.onBefore({}, checkLayoutForChanges);

            if (vm.stateWithLayout) {
                window.addEventListener('beforeunload', function (event) {

                    var layoutCurrentConfigString = JSON.stringify(entityViewerDataService.getLayoutCurrentConfiguration(false));
                    var layoutCurrentConfigHash = stringHelper.toHash(layoutCurrentConfigString);

                    if (activeLayoutHash !== layoutCurrentConfigHash) {
                        event.preventDefault();
                        (event || window.event).returnValue = 'All unsaved changes will be lost.';
                    }

                });
            }

            this.$onDestroy = function () {
                doBeforeStateChange();
            }
        }

    }()
);