/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');

        var evHelperService = require('../../services/entityViewerHelperService');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');

        var entityViewerReducer = require('./entityViewerReducer');

        module.exports = function ($scope, $mdDialog, $state, $transitions) {

            var vm = this;

            vm.listViewIsReady = false;

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

                    entityViewerDataService.setActiveLayoutConfiguration();

                });

            };

            vm.init = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                vm.contentType = $scope.$parent.vm.contentType;
                entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                entityViewerDataService.setContentType($scope.$parent.vm.contentType);

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

            var checkLayoutForChanges = function () {

                if (vm.stateWithLayout) {

                    var activeLayoutConfig = entityViewerDataService.getActiveLayoutConfiguration();
                    var layoutCurrentConfig = entityViewerDataService.getLayoutCurrentConfiguration(false);

                    if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false)) {

                        return new Promise(function (resolve, reject) {

                            $mdDialog.show({
                                controller: 'LayoutChangesLossWarningDialogController as vm',
                                templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                                parent: angular.element(document.body),
                                preserveScope: true,
                                autoWrap: true,
                                multiple: true,
                                locals: {
                                    data: {
                                        evDataService: entityViewerDataService,
                                        entityType: vm.entityType
                                    }
                                }
                            }).then(function (res, rej) {

                                if (res.status === 'save_layout') {

                                    if (layoutCurrentConfig.hasOwnProperty('id')) {

                                        uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                            resolve(true);
                                        });

                                    } else {

                                        if (res.data && res.data.layoutName) {
                                            layoutCurrentConfig.name = res.data.layoutName;
                                        }

                                        uiService.getActiveListLayout(vm.entityType).then(function (data) {

                                            var activeLayout = data.results[0];
                                            activeLayout.is_default = false;
                                            layoutCurrentConfig.is_default = true;

                                            uiService.updateListLayout(activeLayout.id, activeLayout).then(function () {

                                                uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                    resolve(true);
                                                });

                                            });

                                        });

                                    }

                                } else if (res.status === 'do_not_save_layout') {

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

            var warnAboutLayoutChangesLoss = function (event) {

                var activeLayoutConfig = entityViewerDataService.getActiveLayoutConfiguration();
                var layoutCurrentConfig = entityViewerDataService.getLayoutCurrentConfiguration(false);

                if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, true)) {
                    event.preventDefault();
                    (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
                }

            };

            if (vm.stateWithLayout) {
                window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);
            }

            this.$onDestroy = function () {
                doBeforeStateChange();
                window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss);
            }
        }

    }()
);