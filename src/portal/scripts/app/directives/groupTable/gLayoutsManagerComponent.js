(function () {

    'use strict';

    const middlewareService = require('../../services/middlewareService');
    const evEvents = require("../../services/entityViewerEvents");
    const evRvLayoutsHelper = require('../../helpers/evRvLayoutsHelper');
    const popupEvents = require('../../services/events/popupEvents');

    const evHelperService = require('../../services/entityViewerHelperService');
    const uiService = require('../../services/uiService');

    const toastNotificationService = require('../../../../../core/services/toastNotificationService');

    const ecosystemDefaultService = require('../../services/ecosystemDefaultService');

    module.exports = function ($mdDialog, $state) {
        return {
            restrict: 'E',
            templateUrl: 'views/components/g-layouts-manager-view.html',
            scope: {
                entityType: '=',
                evDataService: '=',
                evEventService: '=',
            },
            link: function (scope) {
                console.log('#69 scope', scope)
                scope.layout = scope.evDataService.getListLayout()
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                const isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                let splitPanelLayoutId = null;

                if (!isRootEntityViewer) {
                    const spDefaultLayoutData = scope.evDataService.getSplitPanelDefaultLayout();
                    splitPanelLayoutId = spDefaultLayoutData.layoutId;
                }

                scope.layouts = [];

                scope.deleteItem = function (ev) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: 'Are you sure want to delete this layout?'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {
                        if (res.status === 'agree') {

                            uiService.deleteListLayoutByKey(scope.layout.id).then(async function (data) {

                                scope.layouts = await getLayouts();

                                scope.$apply();
                            });
                        }
                    })
                };

                scope.openLayout = (layout) => {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

/*                    if (layout.user_code) {

                        middlewareService.setNewEntityViewerLayoutName(layout.user_code); // Give signal to update active layout name in the toolbar
                        $state.transitionTo($state.current, {layoutUserCode: layout.user_code});

                    } else {

                        const errorText = 'Layout "' + layout.name + '" has no user code.';
                        toastNotificationService.error(errorText);

                    }*/


                    if (scope.isRootEntityViewer) {

                        if (layout.user_code) {

                            middlewareService.setNewEntityViewerLayoutName(layout.name); // Give signal to update active layout name in the toolbar
                            $state.transitionTo($state.current, {layoutUserCode: layout.user_code});

                        } else {
                            const errorText = 'Layout "' + layout.name + '" has no user code.';
                            toastNotificationService.error(errorText);
                        }

                    } else {
                        middlewareService.setNewSplitPanelLayoutName(layout.name); // Give signal to update active layout name in the toolbar

                        scope.evDataService.setSplitPanelLayoutToOpen(layout.id);
                        scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
                    }

                };

                scope.setAsDefault = (targetLayout) => {

                    // $event.stopPropagation();

                    // var targetLayout = layoutsList[index];

                    if (isRootEntityViewer) {

                        if (!targetLayout.is_default) {

                            scope.layouts.forEach(layout => {

                                layout.is_default = layout.id === targetLayout.id;

                            });

                            targetLayout.is_default = true;

                            uiService.updateListLayout(targetLayout.id, targetLayout).then(function (data) {

                                // needed to update is_default on front-end
                                const listLayout = scope.evDataService.getListLayout();
                                const activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();

                                if (listLayout.id === targetLayout.id) { // if active layout made default

                                    listLayout.is_default = true
                                    listLayout.modified = data.modified
                                    activeLayoutConfig.is_default = true
                                    // activeLayoutConfig.is_default = true

                                } else {

                                    listLayout.is_default = false
                                    activeLayoutConfig.is_default = false

                                }

                                scope.evDataService.setListLayout(listLayout);
                                scope.evDataService.setActiveLayoutConfiguration({layoutConfig: activeLayoutConfig});

                                scope.evEventService.dispatchEvent(evEvents.DEFAULT_LAYOUT_CHANGE);

                            });

                        }

                    } else if (targetLayout.id !== splitPanelLayoutId) {

                        const defaultLayoutData = {
                            layoutId: targetLayout.id,
                            name: targetLayout.name,
                            content_type: targetLayout.content_type
                        };

                        scope.evDataService.setSplitPanelDefaultLayout(defaultLayoutData);
                        scope.evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                        splitPanelLayoutId = targetLayout.id;

                    }

                };

                function clearAdditions() {

                    const additions = scope.evDataService.getAdditions();

                    additions.isOpen = false;
                    additions.type = '';
                    delete additions.layoutData;
                    /*delete additions.layoutId;*/

                    scope.evDataService.setSplitPanelStatus(false);
                    scope.evDataService.setAdditions(additions);

                    scope.currentAdditions = scope.evDataService.getAdditions();

                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                    // delete scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                };

                var createNewLayoutMethod = function () {

                    scope.evDataService.resetData();

                    const rootGroup = scope.evDataService.getRootGroupData();
                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    const defaultList = uiService.getListLayoutTemplate();

                    const listLayout = {};
                    listLayout.data = Object.assign({}, defaultList[0].data);

                    listLayout.name = "New Layout";
                    listLayout.data.columns = [];

                    scope.evDataService.setColumns(listLayout.data.columns);
                    scope.evDataService.setGroups(listLayout.data.grouping);
                    scope.evDataService.setFilters(listLayout.data.filters);

                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    if (!scope.isReport) {
                        scope.evDataService.setListLayout(listLayout);
                    }

                    listLayout.data.components = {
                        sidebar: true,
                        groupingArea: true,
                        columnArea: true,
                        columnAreaHeader: true,
                        splitPanel: true,
                        addEntityBtn: true,
                        fieldManagerBtn: true,
                        layoutManager: true,
                        autoReportRequest: false
                    };

                    scope.evDataService.setComponents(listLayout.data.components);
                    scope.evDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                    scope.evDataService.setRootEntityViewer(true);

                    const interfaceLayout = scope.evDataService.getInterfaceLayout();

                    interfaceLayout.groupingArea.collapsed = false;
                    interfaceLayout.groupingArea.height = 98;
                    interfaceLayout.columnArea.collapsed = false;
                    interfaceLayout.columnArea.height = 70;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                    middlewareService.setNewSplitPanelLayoutName(false);
                    clearAdditions();

                    if (scope.isReport) {

                        const rootGroupOptions = scope.evDataService.getRootGroupOptions();
                        rootGroupOptions.subtotal_type = false;
                        scope.evDataService.setRootGroupOptions(rootGroupOptions);

                        const reportOptions = {};
                        const reportLayoutOptions = {
                            datepickerOptions: {
                                reportFirstDatepicker: {},
                                reportLastDatepicker: {}
                            }
                        };

                        const todaysDate = moment(new Date()).format('YYYY-MM-DD');

                        var finishCreatingNewReportLayout = function () {

                            scope.evDataService.setReportOptions(reportOptions);
                            scope.evDataService.setReportLayoutOptions(reportLayoutOptions);
                            scope.evDataService.setExportOptions({});

                            listLayout.data.reportOptions = reportOptions;
                            listLayout.data.reportLayoutOptions = reportLayoutOptions;
                            listLayout.data.export = {};

                            scope.evDataService.setListLayout(listLayout);

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);
                            scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);

                            scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport});

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar
                            scope.$apply(); // needed to update Report settings area in right sidebar and layout name
                            scope.isNewLayout = true;

                        };

                        reportOptions.cost_method = 1;
                        reportOptions.portfolio_mode = 1;
                        reportOptions.account_mode = 0;
                        reportOptions.strategy1_mode = 0;
                        reportOptions.strategy2_mode = 0;
                        reportOptions.strategy3_mode = 0;
                        reportOptions.accounts_cash = [];
                        // reportOptions.accounts_cash[0] = 1;
                        reportOptions.accounts_position = [];
                        // reportOptions.accounts_position[0] = 1;
                        reportOptions.approach_multiplier = 0.5;
                        reportOptions.calculationGroup = 'portfolio';

                        if (scope.entityType !== 'transaction-report') {

                            if (scope.entityType === 'pl-report') {

                                reportOptions.pl_first_date = todaysDate;

                                reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {
                                    datepickerMode: 'datepicker'
                                };

                            }

                            // For Balance report
                            reportOptions.report_date = todaysDate;

                            reportLayoutOptions.datepickerOptions.reportLastDatepicker = {
                                datepickerMode: 'datepicker'
                            };

                            ecosystemDefaultService.getList().then(function (data) {

                                const defaultValues = data.results[0];
                                reportOptions.pricing_policy = defaultValues.pricing_policy;
                                reportOptions.report_currency = defaultValues.currency;

                                finishCreatingNewReportLayout();

                            });

                        } else { // For transaction report

                            reportOptions.date_field = null;

                            reportOptions.begin_date = todaysDate;

                            reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {
                                datepickerMode: 'datepicker'
                            };

                            reportOptions.end_date = todaysDate;

                            reportLayoutOptions.datepickerOptions.reportLastDatepicker = {
                                datepickerMode: 'datepicker'
                            };

                            finishCreatingNewReportLayout();

                        }

                    } else {

                        scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport});
                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        scope.isNewLayout = true;

                    }

                };

                scope.createNewLayout = function () {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    /*var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();
                    var layoutCurrentConfig = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);*/

                    const activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();

                    let spChangedLayout = false;
                    if (scope.isRootEntityViewer) {

                        const additions = scope.evDataService.getAdditions();
                        if (additions.isOpen) {
                            spChangedLayout = scope.spExchangeService.getSplitPanelChangedLayout();
                        }

                    }

                    let layoutIsUnchanged = true;
                    let layoutCurrentConfig;

                    if (activeLayoutConfig && activeLayoutConfig.data) {
                        layoutCurrentConfig = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                        layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, scope.isReport);
                    }

                    //if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, scope.isReport)) {
                    if (!layoutIsUnchanged || spChangedLayout) {

                        $mdDialog.show({
                            controller: 'LayoutChangesLossWarningDialogController as vm',
                            templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                            parent: angular.element(document.body),
                            preserveScope: false,
                            autoWrap: true,
                            multiple: true,
                            locals: {
                                data: null
                            }
                        }).then(function (res, rej) {

                            if (res.status === 'save_layout') {

                                const layoutsSavePromises = [];

                                // if split panel layout changed, save it
                                if (spChangedLayout) {

                                    const saveSPLayoutChanges = new Promise(function (spLayoutSaveRes, spLayoutSaveRej) {

                                        if (spChangedLayout.hasOwnProperty('id')) {

                                            uiService.updateListLayout(spChangedLayout.id, spChangedLayout).then(function () {
                                                spLayoutSaveRes(true);
                                            });

                                        } else {

                                            uiService.createListLayout(scope.entityType, spChangedLayout).then(function () {
                                                spLayoutSaveRes(true);
                                            });

                                        }

                                    });

                                    layoutsSavePromises.push(saveSPLayoutChanges);

                                }
                                // < if split panel layout changed, save it >

                                /*if (layoutCurrentConfig.hasOwnProperty('id')) {

                                    uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                        createNewLayoutMethod();
                                    });

                                } else {

                                    uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                        createNewLayoutMethod();
                                    });

                                }*/
                                if (activeLayoutConfig && !layoutIsUnchanged) {

                                    const saveLayoutChanges = new Promise(function (saveLayoutRes, saveLayoutRej) {

                                        if (layoutCurrentConfig.hasOwnProperty('id')) {

                                            uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                                saveLayoutRes(true);
                                            });

                                        } else {

                                            if (res.data && res.data.layoutName) {
                                                layoutCurrentConfig.name = res.data.layoutName;
                                            }

                                            /* When saving is_default: true layout on backend, others become is_default: false
                                            uiService.getDefaultListLayout(scope.entityType).then(function (data) {

                                                layoutCurrentConfig.is_default = true;

                                                if (data.count > 0 && data.results) {
                                                    var activeLayout = data.results[0];
                                                    activeLayout.is_default = false;

                                                    uiService.updateListLayout(activeLayout.id, activeLayout).then(function () {

                                                        uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                                            saveLayoutRes(true);
                                                        });

                                                    });

                                                } else {
                                                    uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                                        saveLayoutRes(true);
                                                    });
                                                }

                                            }); */

                                            uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                                saveLayoutRes(true);
                                            });

                                        }

                                        layoutsSavePromises.push(saveLayoutChanges);

                                    });
                                }

                                Promise.all(layoutsSavePromises).then(function () {
                                    createNewLayoutMethod();
                                });

                            } else if (res.status === 'do_not_save_layout') {
                                createNewLayoutMethod();
                            }

                        });

                    } else {
                        createNewLayoutMethod();
                    }
                };

                scope.saveLayoutList = function () {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                    evRvLayoutsHelper.saveLayoutList(scope.evDataService, scope.isReport);

                };

                var applyLayout = function (layout) {

                    if (scope.isRootEntityViewer) {

                        middlewareService.setNewEntityViewerLayoutName(layout.name);

                    } else {
                        scope.evDataService.setSplitPanelDefaultLayout(layout.id);
                        scope.evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                        middlewareService.setNewSplitPanelLayoutName(layout.name); // Give signal to update active split panel layout name in the toolbar
                    }

                    scope.evDataService.setListLayout(layout);
                    scope.evDataService.setActiveLayoutConfiguration({layoutConfig: layout});

                    scope.evEventService.dispatchEvent(evEvents.LAYOUT_NAME_CHANGE);

                    toastNotificationService.success("New layout with name '" + layout.name + "' created");

                    scope.isNewLayout = false;
                    scope.$apply();

                };

                scope.getLayoutByUserCode = function (userCode) {

                    const contentType = metaContentTypesService.findContentTypeByEntity(scope.entityType, 'ui');

                    /* return uiService.getListLayoutDefault({
                        pageSize: 1000,
                        filters: {
                            content_type: contentType,
                            user_code: userCode
                        }
                    }); */
                    return uiService.getListLayout(
                        null,
                        {
                            pageSize: 1000,
                            filters: {
                                content_type: contentType,
                                user_code: userCode
                            }
                        }
                    );

                };

                var overwriteLayout = function (changeableLayout, listLayout) {

                    const id = changeableLayout.id;

                    listLayout.id = id;
                    changeableLayout.data = listLayout.data;
                    changeableLayout.name = listLayout.name;

                    return uiService.updateListLayout(id, changeableLayout);

                };

                scope.saveAsLayoutList = function ($event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    const listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            options: {
                                complexSaveAsLayoutDialog: {
                                    entityType: scope.entityType
                                }
                            }
                        },
                        clickOutsideToClose: false

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            const saveAsLayout = function () {

                                listLayout.name = res.data.name;
                                listLayout.user_code = res.data.user_code;

                                uiService.createListLayout(scope.entityType, listLayout).then(function (data) {

                                    listLayout.id = data.id;
                                    applyLayout(listLayout);

                                }).catch(function (error) {
                                    toastNotificationService.error("Error occurred");
                                });

                            };

                            if (listLayout.id) { // if layout based on another existing layout

                                if (scope.isRootEntityViewer) {

                                    /* uiService.getDefaultListLayout(scope.entityType).then(function (openedLayoutData) {

                                        var currentlyOpenLayout = openedLayoutData.results[0];
                                        currentlyOpenLayout.is_default = false;

                                        uiService.updateListLayout(currentlyOpenLayout.id, currentlyOpenLayout).then(function () {

                                            listLayout.is_default = true;
                                            delete listLayout.id;

                                            saveAsLayout();

                                        }).catch(function (error) {
                                            toastNotificationService.error("Error occurred");
                                        });

                                    }).catch(function (error) {
                                        toastNotificationService.error("Error occurred");
                                    }); */

                                    listLayout.is_default = true;

                                } else { // for split panel

                                    listLayout.is_default = false;
                                    /*delete listLayout.id;
                                    saveAsLayout();*/

                                }

                                delete listLayout.id;
                                saveAsLayout();

                            } else { // if layout was not based on another layout

                                if (scope.isRootEntityViewer) {
                                    listLayout.is_default = true;
                                }

                                saveAsLayout();
                            }
                        }

                        if (res.status === 'overwrite') {

                            const userCode = res.data.user_code;

                            listLayout.name = res.data.name;
                            listLayout.user_code = userCode;

                            scope.getLayoutByUserCode(userCode).then(function (changeableLayoutData) {

                                const changeableLayout = changeableLayoutData.results[0];
                                overwriteLayout(changeableLayout, listLayout).then(function (updatedLayoutData) {

                                    listLayout.is_default = true;
                                    listLayout.modified = updatedLayoutData.modified;
                                    applyLayout(listLayout);

                                });

                            });

                        }

                    });

                };

                const getLayouts = async () => {

                    const {results} = await uiService.getListLayout(scope.entityType, {pageSize: 1000});

                    console.log('#69 getLayouts', results);

                    return results;

                };

                const init = async () => {

                    scope.layouts = await getLayouts();
                    console.log('#69 init scope.layouts', scope.layouts)

                    scope.$apply();

                }

                init();

            }
        }
    }
}());