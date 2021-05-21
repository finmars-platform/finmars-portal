/**
 * Created by vzubr on 02.12.2020.
 * */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');
    var evRvLayoutsHelper = require('../../helpers/evRvLayoutsHelper');

    var currencyService = require('../../services/currencyService');

    module.exports = function ($mdDialog, $state,) {
        return {
            restrict: 'E',
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

                scope.layoutData = {
                	name: ''
				};

				let listLayout = scope.evDataService.getListLayout();

				if (listLayout && listLayout.name) {
					scope.layoutData.name = listLayout.name;
				}

                scope.popupData = {
                    entityType: scope.entityType,
                    evDataService: scope.evDataService,
                    evEventService: scope.evEventService,
                }

				scope.saveLayoutList = function ($event) {

					var isNewLayout = scope.evDataService.isLayoutNew();

					if (isNewLayout) {
						evRvLayoutsHelper.saveAsLayoutList(scope.evDataService, scope.evEventService, scope.isReport, $mdDialog, scope.entityType, $event);

					} else {
						evRvLayoutsHelper.saveLayoutList(scope.evDataService, scope.isReport);
					}

				};

                scope.openMissingPricesDialog = function($event) {

                    $mdDialog.show({
                        controller: 'ReportPriceCheckerDialogController as vm',
                        templateUrl: 'views/dialogs/report-missing-prices/report-price-checker-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: {
                                missingPricesData: scope.missingPricesData,
                                evDataService: scope.evDataService
                            }
                        }
                    })

                };

                scope.toggleFilterBlock = function ($event) {

					const elem = $event.currentTarget;
					elem.classList.contains('active') ? elem.classList.remove('active') : elem.classList.add('active');

					scope.evEventService.dispatchEvent(evEvents.TOGGLE_FILTER_BLOCK);

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

                    /* if (scope.entityType === 'pl-report' || scope.entityType === 'transaction-report') {

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
                    } */
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

                    scope.evDataService.setReportOptions(newReportOptions);
                    scope.evDataService.setReportLayoutOptions(newReportLayoutOptions);

                    scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE); // needed to keep tracks of changes for didLayoutChanged from gActionsBlockComponent

                    setTimeout(function () {
                        scope.$apply();
                    }, 200)
                };

                var initEventListeners =function () {

                    scope.evEventService.addEventListener(evEvents.LAYOUT_NAME_CHANGE, function () {

                    	listLayout = scope.evDataService.getListLayout();

						if (listLayout && listLayout.name) {
							scope.layoutData.name = listLayout.name;
						}

                    });

                    scope.evEventService.addEventListener(evEvents.MISSING_PRICES_LOAD_END, function () {

                        scope.missingPricesData = scope.evDataService.getMissingPrices()


                    });

                };

                var init = async function () {

                    scope.missingPricesData = scope.evDataService.getMissingPrices()

                    initEventListeners();
                };

                init();

            },
        }
    }
}());