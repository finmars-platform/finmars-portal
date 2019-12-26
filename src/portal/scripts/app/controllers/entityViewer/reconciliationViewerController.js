/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var evHelperService = require('../../services/entityViewerHelperService');

        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var AttributeDataService = require('../../services/attributeDataService');

        var reconDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');
        var reconDataProviderService = require('../../services/recon-data-provider/recon-data-provider.service');

        var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

        var expressionService = require('../../services/expression.service');
        var middlewareService = require('../../services/middlewareService');

        module.exports = function ($scope, $mdDialog, $transitions, parentEntityViewerDataService, parentEntityViewerEventService, splitPanelExchangeService) {

            var vm = this;

            console.log("Vertical Split Panel Report Viewer Controller init");

            console.log('parentEntityViewerDataService', parentEntityViewerDataService);
            console.log('parentEntityViewerEventService', parentEntityViewerEventService);

            // vm.readyStatus = {
            //     attributes: false,
            // };

            vm.entityViewerDataService = null;
            vm.entityViewerEventService = null;

            vm.reconciliationData = null; // Needed because of evDataService.resetData;

            vm.matchAvailable = false;

            vm.setEventListeners = function () {

                parentEntityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = parentEntityViewerDataService.getActiveObject();
                    var columns = parentEntityViewerDataService.getColumns();

                    vm.entityViewerDataService.setActiveObjectFromAbove(activeObject);
                    vm.entityViewerDataService.setAttributesFromAbove(columns);


                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);


                    vm.checkMatchAvailability();

                });

                parentEntityViewerEventService.addEventListener(evEvents.UPDATE_SPLIT_PANEL_TABLE_VIEWPORT, function () {

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                });

                parentEntityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

                parentEntityViewerEventService.addEventListener(evEvents.REDRAW_TABLE, function () {
                    vm.checkMatchAvailability();
                });


                vm.entityViewerEventService.addEventListener(evEvents.REDRAW_TABLE, function () {
                    vm.checkMatchAvailability();
                });

                vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = vm.entityViewerDataService.getActiveObject();
                    var action = vm.entityViewerDataService.getActiveObjectAction();

                    if (action === 'recon_view_bank_file_line' && activeObject) {

                        $mdDialog.show({
                            controller: 'ReconMatchViewLineDialogController as vm',
                            templateUrl: 'views/dialogs/reconciliation/recon-match-view-line-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            clickOutsideToClose: false,
                            locals: {
                                data: {
                                    item: activeObject
                                }
                            },
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true
                        }).then(function (res) {

                            vm.entityViewerDataService.setActiveObjectAction(null);
                            vm.entityViewerDataService.setActiveObjectActionData(null);

                        });

                    }

                    vm.checkMatchAvailability();

                });

                vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    console.log('vm.reconciliationData', vm.reconciliationData);

                    vm.entityViewerDataService.setReconciliationData(vm.reconciliationData); // needed because on GroupChange we do evDataService.resetData

                    reconDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                    reconDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                    reconDataProviderService.sortGroupType(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                    reconDataProviderService.processData(vm.entityViewerDataService, vm.entityViewerEventService);

                });



                vm.entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {

                    var spActiveLayout = vm.entityViewerDataService.getSplitPanelActiveLayout();
                    parentEntityViewerDataService.setSplitPanelActiveLayout(spActiveLayout);

                    vm.getView();

                });

                vm.entityViewerEventService.addEventListener(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED, function () {

                    var spDefaultLayout = vm.entityViewerDataService.getSplitPanelDefaultLayout();
                    var additions = parentEntityViewerDataService.getAdditions();
                    additions.layoutData.layoutId = spDefaultLayout;
                    parentEntityViewerDataService.setAdditions(additions);

                });

                // Events that dispatch events inside parent
                vm.entityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

            };

            var getLayoutChanges = function () {
                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();

                if (activeLayoutConfig && activeLayoutConfig.data) {
                    var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                    if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, currentLayoutConfig, true)) {
                        return currentLayoutConfig;
                    }

                }

                return false
            };

            splitPanelExchangeService.setSplitPanelLayoutChangesCheckFn(getLayoutChanges);

            vm.getView = function () {

                // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                // vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = new AttributeDataService();

                parentEntityViewerDataService.setReconciliationDataService(vm.entityViewerDataService);
                parentEntityViewerDataService.setReconciliationEventService(vm.entityViewerEventService);

                vm.entityViewerDataService.setParentDataService(parentEntityViewerDataService);
                vm.entityViewerDataService.setParentEventService(parentEntityViewerEventService);

                console.log('scope, ', $scope);

                vm.entityType = 'reconciliation';


                vm.entityViewerDataService.setEntityType(vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(false);
                vm.entityViewerDataService.setViewContext('reconciliation_viewer');

                var components = {
                    columnArea: true,
                    viewer: true,
                    sidebar: true,
                    groupingArea: true,
                    columnAreaHeader: true,
                    splitPanel: false,
                    addEntityBtn: false,
                    fieldManagerBtn: true,
                    layoutManager: false,
                    autoReportRequest: false
                };

                vm.entityViewerDataService.setComponents(components);


                var reconciliationData = parentEntityViewerDataService.getReconciliationData();

                vm.reconciliationData = JSON.parse(JSON.stringify(reconciliationData));

                vm.entityViewerDataService.setReconciliationData(reconciliationData);

                console.log("Get View Vertical panel?", reconciliationData);

                var columns = [];

                if (reconciliationData.length) {
                    Object.keys(reconciliationData[0]).forEach(function (key) {

                        var col = {};
                        col.key = key;
                        col.name = key;
                        col.value_type = 10;

                        columns.push(col)

                    })
                }

                vm.entityViewerDataService.setColumns(columns);

                vm.setEventListeners();

                reconDataProviderService.processData(vm.entityViewerDataService, vm.entityViewerEventService);


            };


            vm.checkMatchAvailability = function(){

                vm.matchAvailable = false;

                var rootObjectsCount = parentEntityViewerDataService.getActiveObjectsCount();
                var reconObjectsCount = vm.entityViewerDataService.getActiveObjectsCount();

                console.log('checkMatchAvailability.rootObjectsCount', rootObjectsCount);
                console.log('checkMatchAvailability.reconObjectsCount', reconObjectsCount);

                if (rootObjectsCount > 0 && reconObjectsCount > 0) {
                    vm.matchAvailable = true;
                }

                console.log('vm.matchAvailable', vm.matchAvailable);

                setTimeout(function () {

                    $scope.$apply();

                }, 0)

            };

            vm.init = function () {

                vm.getView();

            };

            vm.init();


        }

    }()
);