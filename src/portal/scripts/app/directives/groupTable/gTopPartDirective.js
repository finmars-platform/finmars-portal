/**
 * Created by vzubr on 02.12.2020.
 * */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');
    var evRvLayoutsHelper = require('../../helpers/evRvLayoutsHelper');

    var middlewareService = require('../../services/middlewareService');

    var uiService = require('../../services/uiService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var currencyService = require('../../services/currencyService');

    module.exports = function ($mdDialog, $state) {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/g-top-part-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                spExchangeService: '=', // TODO may be not need
            },
            link: function (scope, ) {

                scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType) || false;
                scope.reportOptions = scope.evDataService.getReportOptions();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.layoutName = '';

                scope.layout = scope.evDataService.getListLayout()
                if (scope.layout && scope.layout.name) {
                    scope.layoutName = scope.layout.name;
                }

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

                var overwriteLayout = function (changeableLayout, listLayout) {

                    var id = changeableLayout.id;

                    listLayout.id = id;
                    changeableLayout.data = listLayout.data;
                    changeableLayout.name = listLayout.name;

                    return uiService.updateListLayout(id, changeableLayout);

                };

                scope.getLayoutByUserCode = function (userCode) {

                    var contentType = metaContentTypesService.findContentTypeByEntity(scope.entityType, 'ui');

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

                scope.openLayoutList = function ($event) {

                    $mdDialog.show({
                        controller: 'UiLayoutListDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-list-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: false,
                        locals: {
                            options: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService,
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            if (scope.isRootEntityViewer) {

                                if (res.data.layoutUserCode) {

                                    middlewareService.setNewEntityViewerLayoutName(res.data.layoutName); // Give signal to update active layout name in the toolbar
                                    $state.transitionTo($state.current, {layoutUserCode: res.data.layoutUserCode});

                                } else {
                                    var errorText = 'Layout "' + res.data.layoutName + '" has no user code.';
                                    toastNotificationService.error(errorText);
                                }

                            } else {
                                middlewareService.setNewSplitPanelLayoutName(res.data.layoutName); // Give signal to update active layout name in the toolbar

                                scope.evDataService.setSplitPanelLayoutToOpen(res.data.layoutId);
                                scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
                            }

                        }

                    })
                };

                scope.saveLayoutList = function () {
                    evRvLayoutsHelper.saveLayoutList(scope.evDataService, scope.isReport);
                };

                scope.saveAsLayoutList = function ($event) {

                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

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

                            var saveAsLayout = function () {

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

                            var userCode = res.data.user_code;

                            listLayout.name = res.data.name;
                            listLayout.user_code = userCode;

                            scope.getLayoutByUserCode(userCode).then(function (changeableLayoutData) {

                                var changeableLayout = changeableLayoutData.results[0];
                                overwriteLayout(changeableLayout, listLayout).then(function (updatedLayoutData) {

                                    listLayout.is_default = true;
                                    listLayout.modified = updatedLayoutData.modified;
                                    applyLayout(listLayout);

                                });

                            });

                        }

                    });

                };

                var openReportSettings = function ($event) {

                    var reportOptions = scope.evDataService.getReportOptions();

                    $mdDialog.show({
                        controller: 'GReportSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            reportOptions: reportOptions,
                            options: {
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            reportOptions = res.data;

                            scope.evDataService.setReportOptions(reportOptions);

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                        }

                    })

                };

                var openEntityViewerSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'GEntityViewerSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-entity-viewer-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            entityViewerDataService: scope.evDataService,
                            entityViewerEventService: scope.evEventService
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.evEventService.dispatchEvent(evEvents.ENTITY_VIEWER_SETTINGS_CHANGED);
                        }

                    });

                };

                scope.onSettingsClick = function ($event) {

                    return scope.isReport ? openReportSettings($event) : openEntityViewerSettings($event);

                };

                var prepareReportLayoutOptions = function () {

                    scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                    // preparing data for complexZhDatePickerDirective
                    if (!scope.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {
                        scope.reportLayoutOptions.datepickerOptions = {};
                    }

                    if (!scope.reportLayoutOptions.datepickerOptions.hasOwnProperty('reportLastDatepicker')) {
                        scope.reportLayoutOptions.datepickerOptions.reportLastDatepicker = {};
                    }

                    if (!scope.reportLayoutOptions.datepickerOptions.hasOwnProperty('reportFirstDatepicker')) {
                        scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {};
                    }

                    scope.datepickerFromDisplayOptions = {
                        position: 'left',
                        labelName: 'Date from (excl)'
                    };

                    scope.datepickerToDisplayOptions = {position: 'left'};

                    if (scope.entityType === 'pl-report' || scope.entityType === 'transaction-report') {

                        if (scope.entityType === 'transaction-report') {
                            scope.datepickerFromDisplayOptions = {
                                position: 'left',
                                labelName: 'Date from (incl)'
                            };
                        }

                        scope.datepickerToDisplayOptions = {
                            position: 'left',
                            labelName: 'Date to (incl)',
                            modes: {
                                inception: false
                            }
                        }
                    }
                    /* < preparing data for complexZhDatePickerDirective > */

                };

                if (scope.isReport) {

                    var currencyOptions = {
                        pageSize: 1000,
                        page: 1
                    };

                    scope.currencies = [];

                    var getCurrencies = function () {

                        new Promise(function (resolve, reject) {

                            currencyService.getListLight(currencyOptions).then(function (data) {

                                scope.currencies = scope.currencies.concat(data.results);
                                console.log('#69 scope.currencies', scope.currencies)

                                if (data.next) {

                                    currencyOptions.page = currencyOptions.page + 1;
                                    // Victor 2020.12.03 may be not need
                                    //getPricingPolicies(resolve, reject);

                                } else {
                                    scope.$apply();
                                    resolve(true);
                                }

                            }).catch(function (error) {
                                reject(error);
                            });

                        });

                    };

                    getCurrencies();

                    prepareReportLayoutOptions();
                    console.log('#69 reportOptions', scope.reportOptions);
                    console.log('#69 reportLayoutOptions', scope.reportLayoutOptions);
                    console.log('#69 datepickerToDisplayOptions', scope.datepickerToDisplayOptions);

                }

                scope.updateReportOptions = function () {

                    var reportOptions = scope.evDataService.getReportOptions();
                    var reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                    var newReportOptions = Object.assign({}, reportOptions, scope.reportOptions);
                    var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, scope.reportLayoutOptions);
                    // TODO Delete in future
                    delete newReportLayoutOptions.reportFirstDatepicker;
                    delete newReportLayoutOptions.reportLastDatepicker;
                    // < Delete in future >
                    console.log('#69 updateReportOptions', newReportOptions, newReportLayoutOptions);

                    scope.evDataService.setReportOptions(newReportOptions);
                    scope.evDataService.setReportLayoutOptions(newReportLayoutOptions);

                    scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE); // needed to keep tracks of changes for didLayoutChanged from gActionsBlockComponent

                    setTimeout(function () {
                        scope.$apply();
                    }, 200)
                };

                var initEventListeners =function () {
                    scope.evEventService.addEventListener(evEvents.LAYOUT_NAME_CHANGE, function () {
                        var listLayout = scope.evDataService.getListLayout();
                        scope.layoutName = listLayout.name;

                    });

                };



                var init = function () {
                    initEventListeners();
                };

                init();

            },
        }
    }
}());