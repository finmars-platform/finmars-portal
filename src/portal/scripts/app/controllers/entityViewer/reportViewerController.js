/**
 /**
 * Created by szhitenev on 05.05.2016.
 */

'use strict';

// import AutosaveLayoutService from "../../services/autosaveLayoutService";
// import evHelperService from "../../services/entityViewerHelperService";
// 2024-01-12 szhitenev vite migration




(function () {

    var AutosaveLayoutService = require("../../services/autosaveLayoutService").default;
    var evHelperService = require("../../services/entityViewerHelperService");
    var metaService = require('../../services/metaService').default;

    var evEvents = require("../../services/entityViewerEvents");
    var localStorageService = require("../../../../../shell/scripts/app/services/localStorageService");

    var RvSharedLogicHelper = require('../../helpers/rvSharedLogicHelper');
    var EntityViewerDataService = require('../../services/entityViewerDataService');
    var EntityViewerEventService = require('../../services/eventService');
    var SplitPanelExchangeService = require('../../services/groupTable/exchangeWithSplitPanelService');
    var AttributeDataService = require('../../services/attributeDataService');

    module.exports = function ($scope, $mdDialog, $stateParams, $transitions, toastNotificationService, middlewareService, globalDataService, priceHistoryService, currencyHistoryService, metaContentTypesService, customFieldService, attributeTypeService, uiService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper, evRvLayoutsHelper) {

        var vm = this;

        var sharedLogicHelper = new RvSharedLogicHelper(vm, $scope, $mdDialog, toastNotificationService, globalDataService, priceHistoryService, currencyHistoryService, metaContentTypesService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper);

        vm.readyStatus = {
            attributes: false,
            layout: false // changed by rvSharedLogicHelper.onSetLayoutEnd();
        };

        var onLogoutIndex, onUserChangeIndex;

        // var doNotCheckLayoutChanges = false;
        var autosaveLayoutService;
        var autosaveLayoutOn = globalDataService.isAutosaveLayoutOn();
        // console.log("autosave77 autosaveLayoutOn", autosaveLayoutOn);
        // Functions for context menu

        var firstDleIndex;

        vm.setEventListeners = function () {

            vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                // rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                rvDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                // Frontend is deprecated since 2023-09-10
                // if (window.location.href.indexOf('v2=true') !== -1) {
                //     rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                // } else {
                //     rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                // }


            });

            firstDleIndex = vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                /* *
                 * Fixes scenario when DATA_LOAD_END
                 * called inside evDataProviderService.updateDataStructure()
                 * before gTableBodyComponent initialized
                 * */
                vm.entityViewerDataService.setDataLoadStatus(true);

                vm.entityViewerEventService.removeEventListener(evEvents.DATA_LOAD_END, firstDleIndex);

            });

            vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                rvDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

            });

            vm.entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                rvDataProviderService.sortGroupType(vm.entityViewerDataService, vm.entityViewerEventService);

            });

            vm.entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                // rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);
                // rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                // rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                // Frontend is deprecated since 2023-09-10
                // if (window.location.href.indexOf('v2=true') !== -1) {
                //     rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                // } else {
                //     rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);
                // }

            });

            vm.entityViewerEventService.addEventListener(evEvents.CREATE_TABLE, function () {

                vm.entityViewerDataService.resetTableContent(true);

                rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

            });

            /* vm.entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {

                vm.getView();

            }); */
            vm.entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {
                autosaveLayoutService.removeChangesTrackingEventListeners(vm.entityViewerEventService);
            });

            vm.entityViewerEventService.addEventListener(evEvents.ROWS_ACTION_FIRED, sharedLogicHelper.executeRowAction);

            vm.entityViewerEventService.addEventListener(evEvents.USER_REQUEST_AN_ACTION, sharedLogicHelper.executeUserRequestedAction)

            /* const dleEventIndex = vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED, function () {
                evRvLayoutsHelper.initListenersForAutosaveLayout(vm.entityViewerDataService, vm.entityViewerEventService, true);
                vm.entityViewerEventService.removeEventListener(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED, dleEventIndex);
            }); */
            if (autosaveLayoutOn) {

                const alcIndex = vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED, function () {
                    autosaveLayoutService.initListenersForAutosaveLayout(vm.entityViewerDataService, vm.entityViewerEventService, true);
                    vm.entityViewerEventService.removeEventListener(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED, alcIndex);
                });

            }

        };


        vm.isLayoutFromUrl = function () {
            return window.location.href.indexOf('?layout=') !== -1
        };

        vm.getActiveObjectFromQueryParameters = function () {

            var queryParameters = window.location.href.split('?')[1];

            var result = null;

            if (queryParameters) {

                var parameters = queryParameters.split('&');

                result = {};

                parameters.forEach(function (parameter) {

                    var pieces = parameter.split('=');
                    var key = pieces[0];
                    var value = pieces[1];

                    result[key] = decodeURI(value);

                });

                return result;

            }

        };

        vm.closeGroupsAndContinueReportGeneration = function () {

            var localStorageReportData = localStorageService.getReportData();

            var layout = vm.entityViewerDataService.getListLayout();
            var contentType = vm.entityViewerDataService.getContentType();

            delete localStorageReportData[contentType][layout.user_code]

            var groups = vm.entityViewerDataService.getGroups();

            groups.forEach(function (group) {

                if (!group.report_settings) {
                    group.report_settings = {}
                }

                group.report_settings.is_level_folded = true;

            })

            vm.entityViewerDataService.setGroups(groups);

            localStorageService.cacheReportData(localStorageReportData);

            vm.possibleToRequestReport = true;

            rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

        }

        vm.continueReportGeneration = function () {

            vm.possibleToRequestReport = true;

            rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
        }

        vm.setFiltersValuesFromQueryParameters = function () {

            var activeObject = vm.getActiveObjectFromQueryParameters();

            if (activeObject) {

                console.log('vm.getView activeObject', activeObject);

                var filters = vm.entityViewerDataService.getFilters();

                filters.forEach(function (item) {

                    if (activeObject.hasOwnProperty(item.key)) {
                        item.options.filter_values = [activeObject[item.key]]
                    }

                })

            }

        };

        var deregisterOnBeforeTransitionHook;

        var checkLayoutsForChanges = function () { // called on attempt to change or reload page
            // console.log("autosave77 rv checkLayoutsForChanges ", autosaveLayoutOn);

            var checkForLayoutChanges = vm.entityViewerDataService.isLayoutChangesLossWarningNeeded();

            if (checkForLayoutChanges) {
                return evHelperService.warnAboutChangesToLoose(vm.entityViewerDataService, vm.splitPanelExchangeService, $mdDialog);

            } else {

                removeTransitionListeners();

                return new Promise(function (resolve) {
                    resolve(true);
                });

            }

        };

        var warnAboutLayoutChangesLoss = function (event) {

            var layoutHasChanges = evHelperService.checkRootLayoutForChanges(vm.entityViewerDataService, true);
            var spChangedLayout = evHelperService.checkSplitPanelForChanges(vm.entityViewerDataService, vm.splitPanelExchangeService);

            if (layoutHasChanges || spChangedLayout) {
                // console.log("autosave77 ev warnAboutLayoutChangesLoss ", autosaveLayoutOn);
                event.preventDefault();
                (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
            }

        };

        var initTransitionListeners = function () {
            deregisterOnBeforeTransitionHook = $transitions.onBefore({}, checkLayoutsForChanges);
            window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);
        };

        var removeTransitionListeners = function () {

            if (deregisterOnBeforeTransitionHook) {
                deregisterOnBeforeTransitionHook();
            }

            window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss);

        };

        /**
         * Integrates report viewer layout into front end. Called from module:entityViewerHelperService by callbacks getLayoutByUserCode or getDefaultLayout.
         *
         * @param layout {Object}
         * @returns {Promise<unknown>}
         */
        vm.setLayout = function (layout) {

            return new Promise(async function (resolve, reject) {

                if (typeof layout.data.reportLayoutOptions.useDateFromAbove !== 'boolean') {
                    layout.data.reportLayoutOptions.useDateFromAbove = true;
                }

                vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);

                vm.setFiltersValuesFromQueryParameters();

                // var reportOptions = vm.entityViewerDataService.getReportOptions();
                var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                var additions = vm.entityViewerDataService.getAdditions();
                var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();

                if (additions.isOpen && interfaceLayout.splitPanel.height && interfaceLayout.splitPanel.height > 0) {

                    try {
                        await uiService.pingListLayoutByKey(additions.layoutData.layoutId, {notifyError: false});
                        vm.entityViewerDataService.setSplitPanelStatus(true);

                    } catch (error) { // layout for split panel was not found

                        console.error('Error on getting layout with an id: ' + additions.layoutData.layoutId + ' for split panel');
                        if (error && error.error.status_code === 404) {

                            /* interfaceLayout.splitPanel.height = 0;
                            vm.entityViewerDataService.setInterfaceLayout(interfaceLayout);

                            additions.isOpen = false;
                            additions.type = '';
                            delete additions.layoutData;

                            vm.entityViewerDataService.setAdditions(additions);

                            vm.entityViewerDataService.setSplitPanelStatus(false);*/
                            evRvLayoutsHelper.clearSplitPanelAdditions(vm.entityViewerDataService);

                        }

                    }

                }

                interfaceLayout.filterArea.width = 0;

                // Check if there is need to solve report datepicker expression
                if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {

                    await sharedLogicHelper.calculateReportDatesExprs();
                    vm.readyStatus.layout = sharedLogicHelper.onSetLayoutEnd();

                    var activeColumnSortProm = new Promise(function (sortResolve, sortReject) {

                        var activeColumnSort = vm.entityViewerDataService.getActiveColumnSort();

                        console.log('activeColumnSortProm.activeColumnSort', activeColumnSort);

                        if (activeColumnSort && activeColumnSort.options.sort_settings.layout_user_code) {

                            uiService.getColumnSortDataList({
                                filters: {
                                    user_code: activeColumnSort.options.sort_settings.layout_user_code
                                }

                            }).then(function (data) {

                                if (data.results.length) {

                                    var layout = data.results[0];

                                    console.log('activeColumnSortProm', layout);

                                    vm.entityViewerDataService.setColumnSortData(activeColumnSort.key, layout.data)

                                } else {

                                    toastNotificationService.error("Manual Sort is not configured");

                                    activeColumnSort.options.sort_settings.layout_user_code = null;

                                }

                                sortResolve();

                            })

                        } else {
                            sortResolve();
                        }

                    });


                    Promise.all([activeColumnSortProm]).then(function () {
                        resolve();
                    });

                } else {
                    vm.readyStatus.layout = sharedLogicHelper.onSetLayoutEnd();
                }

                resolve();

            });

        };

        vm.getView = function () {

            console.log('reportViewerController.getView')

            vm.openGroupsCount = null;
            vm.possibleToRequestReport = false // !important, do not remove, on change layout we should again ask user about groups

            // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

            vm.readyStatus.layout = false; // switched to true by sharedLogicHelper.onSetLayoutEnd()

            vm.entityViewerDataService = new EntityViewerDataService(reportHelper);
            vm.entityViewerEventService = new EntityViewerEventService();
            vm.splitPanelExchangeService = new SplitPanelExchangeService();
            vm.attributeDataService = new AttributeDataService(metaContentTypesService, customFieldService, attributeTypeService, uiService);

            vm.entityType = $scope.$parent.vm.entityType;

            // calls setEntityType, setIsReport etc
            sharedLogicHelper.setLayoutDataForView();

            vm.entityViewerDataService.setRootEntityViewer(true);
            vm.entityViewerDataService.setViewContext(vm.viewContext);

            vm.entityViewerDataService.setLayoutChangesLossWarningState(true);

            /* let rowTypeFilters = localStorage.getItem("row_type_filter");

            if (rowTypeFilters) {

                rowTypeFilters = JSON.parse(rowTypeFilters);
                const rowFilterColor = rowTypeFilters.markedRowFilters;
                vm.entityViewerDataService.setRowTypeFilters(rowFilterColor);

            } */

            var downloadAttrsProm = sharedLogicHelper.downloadAttributes();
            var setLayoutProm;

            vm.setEventListeners();

            middlewareService.onAutosaveLayoutToggle(function () {

                autosaveLayoutOn = globalDataService.isAutosaveLayoutOn();

                if (autosaveLayoutOn) {

                    autosaveLayoutService.initListenersForAutosaveLayout(vm.entityViewerDataService, vm.entityViewerEventService, true);
                    removeTransitionListeners();

                    var layoutHasChanges = evHelperService.checkRootLayoutForChanges(vm.entityViewerDataService, true);
                    // var spChangedLayout = evHelperService.checkSplitPanelForChanges(vm.entityViewerDataService, vm.splitPanelExchangeService);

                    if (layoutHasChanges) {
                        autosaveLayoutService.forceAutosaveLayout();
                    }

                } else {
                    autosaveLayoutService.removeChangesTrackingEventListeners(vm.entityViewerEventService);
                    initTransitionListeners();
                }

                vm.entityViewerEventService.dispatchEvent(evEvents.TOGGLE_AUTOSAVE);

            });

            var layoutUserCode;

            if (vm.isLayoutFromUrl()) {

                var queryParams = window.location.href.split('?')[1];
                var params = queryParams.split('&');

                params.forEach(function (param) {

                    var pieces = param.split('=');
                    var key = pieces[0];
                    var value = pieces[1];

                    if (key === 'layout') {
                        layoutUserCode = value;

                        if (layoutUserCode.indexOf('%20') !== -1) {
                            layoutUserCode = layoutUserCode.replace(/%20/g, " ")
                        }
                    }

                });

                // vm.getLayoutByUserCode(layoutUserCode);
                setLayoutProm = evHelperService.getLayoutByUserCode(vm, layoutUserCode, $mdDialog);

            } else if ($stateParams.layoutUserCode) {

                layoutUserCode = $stateParams.layoutUserCode;
                // vm.getLayoutByUserCode(layoutUserCode);
                setLayoutProm = evHelperService.getLayoutByUserCode(vm, layoutUserCode, $mdDialog);

            } else {
                // vm.getDefaultLayout();
                setLayoutProm = evHelperService.getDefaultLayout(vm);
            }

            Promise.allSettled([downloadAttrsProm, setLayoutProm]).then(function (getViewData) {


                metaService.logRejectedPromisesAfterAllSettled(getViewData, 'report viewer get view');

                $scope.$apply();

            });

        };

        vm.init = function () {

            autosaveLayoutService = new AutosaveLayoutService(metaContentTypesService, uiService, reportHelper, globalDataService);

            onUserChangeIndex = middlewareService.onMasterUserChanged(function () {
                vm.entityViewerDataService.setLayoutChangesLossWarningState(false);
                removeTransitionListeners();
            });

            onLogoutIndex = middlewareService.addListenerOnLogOut(function () {
                vm.entityViewerDataService.setLayoutChangesLossWarningState(false);
                removeTransitionListeners();
            });

            if (!autosaveLayoutOn) {
                // console.log("autosave77 rv init initTransitionListeners", autosaveLayoutOn);
                initTransitionListeners();
            }

            vm.getView();

        };

        this.$onDestroy = function () {

            middlewareService.removeOnUserChangedListeners(onUserChangeIndex);
            middlewareService.removeOnLogOutListener(onLogoutIndex);

            removeTransitionListeners();

        }

        vm.init();
    }

}());