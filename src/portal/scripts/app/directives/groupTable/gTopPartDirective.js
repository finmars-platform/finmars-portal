/**
 * Created by vzubr on 02.12.2020.
 * */
const evEvents = require("../../services/entityViewerEvents");
(function () {

    'use strict';

    var metaService = require('../../services/metaService').default;
    var evEvents = require('../../services/entityViewerEvents');

    var currencyService = require('../../services/currencyService').default;
    var portfolioRepository = require('../../repositories/portfolioRepository');
    var portfolioReconcileHistoryService = require('../../services/portfolioReconcileHistoryService').default;

    module.exports = function ($mdDialog, $state, usersService, ecosystemDefaultService, globalDataService, evRvLayoutsHelper, reportHelper) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/groupTable/g-top-part-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                spExchangeService: '=',
            },
            link: function (scope,) {

                scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType) || false;
                scope.reportOptions = scope.evDataService.getReportOptions();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.viewContext = scope.evDataService.getViewContext();

                scope.portfoliosList = [];
                scope.filteredPortfoliosList = [];
                scope.failedReconcileData = {
                    count: 0,
                    results: {}
                };

                scope.globalTableSearch = ''

                scope.layoutData = {
                    name: ''
                };

                let listLayout = scope.evDataService.getListLayout();
                let plFirstDateForStatus = scope.reportOptions?.pl_first_date || '';

                let dateFromKey;
                let dateToKey;

                if (listLayout && listLayout.name) {
                    scope.layoutData.name = listLayout.name;
                }

                scope.cDatepickerPosX = {value: 0};

                scope.popupData = {
                    entityType: scope.entityType,
                    evDataService: scope.evDataService,
                    evEventService: scope.evEventService,
                    spExchangeService: scope.spExchangeService
                };

                scope.onGlobalTableSearchChange = function () {

                    scope.evDataService.setGlobalTableSearch(scope.globalTableSearch);

                    scope.evDataService.resetTableContent(false);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                scope.saveLayoutList = function ($event) {

                    var isNewLayout = scope.evDataService.isLayoutNew();

                    if (isNewLayout) {
                        evRvLayoutsHelper.saveAsLayoutList(scope.evDataService, scope.evEventService, scope.isReport, $mdDialog, scope.entityType, $event);

                    } else {
                        evRvLayoutsHelper.saveLayoutList(scope.evDataService, scope.isReport, usersService, globalDataService);
                    }

                };

                scope.openMissingPricesDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'ReportPriceCheckerDialogController as vm',
                        templateUrl: 'views/dialogs/report-missing-prices/report-price-checker-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        locals: {
                            data: {
                                missingPricesData: scope.missingPricesData,
                                failedReconcileData: scope.failedReconcileData,
                                evDataService: scope.evDataService
                            }
                        }
                    })

                };

                scope.toggleFilterBlock = function ($event) {

                    const elem = $event.currentTarget;

                    if ( elem.classList.contains('active') ) {

                        elem.classList.remove('active');

                    } else {
                        elem.classList.add('active')
                    }

                    scope.evEventService.dispatchEvent(evEvents.TOGGLE_FILTER_BLOCK);

                };

                var openReportSettings = function ($event) {

                    // var reportOptions = scope.evDataService.getReportOptions();

                    $mdDialog.show({
                        controller: 'GReportSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            /*reportOptions: reportOptions,
                            options: {
                                entityType: scope.entityType
                            }*/
                            data: {
                                evDataService: scope.evDataService,
                                evEventService: scope.evEventService,
                                attributeDataService: scope.attributeDataService
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.evDataService.setReportLayoutOptions(res.data.reportLayoutOptions);
                            scope.evDataService.setReportOptions(res.data.reportOptions);

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                        }

                    })

                };

                var openEntityViewerSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'GEntityViewerSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-entity-viewer-settings-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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

                scope.onSettingsClick = scope.isReport ? openReportSettings : openEntityViewerSettings;

                var datesKeysData = [
                    {
                        'pl-report': 'pl_first_date',
                        'transaction-report': 'begin_date',
                    },
                    {
                        'balance-report': 'report_date',
                        'pl-report': 'report_date',
                        'transaction-report': 'end_date',
                    }
                ];

                var prepareReportLayoutOptions = function () {

                    scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                    //# region preparing data for complexZhDatePickerDirective
                    if (!scope.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {
                        scope.reportLayoutOptions.datepickerOptions = {};
                    }

                    if (!scope.reportLayoutOptions.datepickerOptions.hasOwnProperty('reportFirstDatepicker')) {
                        scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {};
                    }

                    if (!scope.reportLayoutOptions.datepickerOptions.hasOwnProperty('reportLastDatepicker')) {
                        scope.reportLayoutOptions.datepickerOptions.reportLastDatepicker = {};
                    }


                    /*scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.dateKey = datesKeysData[0][scope.entityType];
                    scope.reportLayoutOptions.datepickerOptions.reportLastDatepicker.dateKey = datesKeysData[1][scope.entityType];*/

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
                    //# endregion

					if (typeof scope.reportLayoutOptions.useDateFromAbove !== 'boolean') {
						scope.reportLayoutOptions.useDateFromAbove = true;
					}

                };

                const getCurrencies = function () {

                    const currencyOptions = {
                        pageSize: 1000,
                        page: 1
                    };

                    new Promise(function (resolve, reject) {

                        currencyService.getListLight(currencyOptions).then(async function (data) {

                            scope.currencies = scope.currencies.concat(data.results);

                            if (!scope.currencies.length) {

                                const ecosystemDefaultData = await ecosystemDefaultService.getList().then(res => res.results[0]);
                                scope.currencies.push(ecosystemDefaultData.currency_object);
                                scope.reportOptions.report_currency = ecosystemDefaultData.currency_object.id;

                            }

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

                const updateReportLayoutOptions = function () {

                    const reportLayoutOptions = scope.evDataService.getReportLayoutOptions();
                    const newReportLayoutOptions = {...reportLayoutOptions, ...scope.reportLayoutOptions};

                    scope.evDataService.setReportLayoutOptions(newReportLayoutOptions);

                };

                if (scope.isReport) {

                    scope.currencies = [];
                    /*scope.dateFrom = scope.reportOptions[dateFromKey];
                    scope.dateTo = scope.reportOptions[dateToKey];*/
                    scope.onReportDateChange = function () {

                        if (scope.viewContext !== 'split_panel' || !scope.reportLayoutOptions.useDateFromAbove) {

                            if (dateFromKey) {
                                scope.reportOptions[dateFromKey] = scope.datesData.from;
                            }

                            scope.reportOptions[dateToKey] = scope.datesData.to;

                        }

                        scope.updateReportOptions();

                    };

                    scope.toggleUseDateFromAbove = function () {
                        // reportLayoutOptions.useDateFromAbove updated inside entityViewerDataService by mutation
                        updateReportLayoutOptions();

                        scope.evEventService.dispatchEvent(evEvents.TOGGLE_USE_REPORT_DATE_FROM_ABOVE);

                        // event REPORT_OPTIONS_CHANGE dispatched from splitPanelReportViewerController as reaction to TOGGLE_USE_REPORT_DATE_FROM_ABOVE
                        if (scope.viewContext !== 'split_panel') {
                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);
                        }

                    };

                    scope.useDateFromAboveName = scope.entityType === 'balance-report' ? 'Link date' : 'Link date';

                }

                scope.updateReportOptions = function () {

                    var reportOptions = scope.evDataService.getReportOptions();
                    // delete reportLayoutOptions.datepickerOptions.reportFirstDatepicker.secondDate;
                    var newReportOptions = Object.assign({}, reportOptions, scope.reportOptions);

                    scope.evDataService.setReportOptions(newReportOptions);

                    updateReportLayoutOptions();

                    scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                    setTimeout(function () {
                        scope.$apply();
                    }, 200)
                };

                /*scope.toggleUseDateFromAbove = scope.updateReportOptions;

                if (!scope.isRootEntityViewer) {

                    scope.toggleUseDateFromAbove = function () {

                        if (!scope.reportLayoutOptions.useDateFromAbove) {

                            if (dateFromKey) {
                                scope.reportOptions[dateFromKey] = scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.date;
                            }

                            scope.reportOptions[dateToKey] = scope.reportLayoutOptions.datepickerOptions.reportLastDatepicker.date;

                        }

                        scope.updateReportOptions();

                    };

                }*/

                const getFilteredTablePortfolios = function () {
                    if (scope.entityType === 'pl-report') {
                        return scope.reportOptions.portfolios_table_data_items
                          .map(group => {
                              const [key1, key2] = group.___group_type_key.split('.');
                              if (key1 === 'portfolio') {
                                  return scope.portfoliosList.filter(
                                    portfolio => portfolio[key2] === group.___group_name
                                  );
                              }
                              return [];
                          })
                          .flat();
                    }

                    if (scope.entityType === 'transaction-report') {
                        const filterSettings = scope.reportOptions.frontend_request_options?.filter_settings || [];
                        const globalPortfolioIds = scope.reportOptions.portfolios || [];

                        const filteredPortfoliosLocal = filterSettings.flatMap(filterItem => {
                            const [key1, key2] = filterItem.key.split('.');
                            if (key1 === 'portfolio') {
                                return scope.portfoliosList.filter(portfolio =>
                                  filterItem.value.includes(portfolio[key2])
                                );
                            }
                            return [];
                        });

                        const filteredPortfoliosGlobal = scope.portfoliosList.filter(portfolio =>
                          globalPortfolioIds.includes(portfolio.id)
                        );

                        const mergedPortfolios = [...filteredPortfoliosLocal, ...filteredPortfoliosGlobal];

                        // Remove duplicates by portfolio id
                        return mergedPortfolios.filter(
                          (portfolio, index, self) =>
                            index === self.findIndex(p => p.id === portfolio.id)
                        );
                    }

                    return scope.portfoliosList;
                };

                const getFilteredEarliestDate = function () {
                    let portfoliosListOfTable;
                    if (!scope.reportOptions.portfolios_table_data_items?.length) {
                        portfoliosListOfTable = scope.portfoliosList;
                    } else {
                        portfoliosListOfTable = getFilteredTablePortfolios();
                    }

                    if (portfoliosListOfTable?.length) {
                        const dates = portfoliosListOfTable.map(item => item.first_transaction_date);
                        const validDates = dates.filter(date => date !== null).map(date => new Date(date).getTime());
                        const earliestDate = new Date(Math.min(...validDates));
                        return earliestDate.toISOString().split('T')[0];
                    } else if(scope.portfoliosList?.length){
                        const dates = scope.portfoliosList.map(item => item.first_transaction_date);
                        const validDates = dates.filter(date => date !== null).map(date => new Date(date).getTime());
                        const earliestDate = new Date(Math.min(...validDates));
                        return earliestDate.toISOString().split('T')[0];
                    } else {
                        return '0001-01-01';
                    }
                }

                function getPortfolios() {
                    return portfolioRepository.getList()
                      .then(function (data) {
                          if (data?.results?.length) {
                              scope.portfoliosList = data.results;
                          } else {
                              scope.portfoliosList = [];
                          }
                      })
                      .catch(function (error) {
                          console.log('getPortfolios error: ', error);
                          scope.portfoliosList = [];
                      });
                }

                function getReconcileStatus() {
                    if (!scope.reportOptions?.portfolios?.length) {
                        scope.filteredPortfoliosList = scope.portfoliosList.map(item => item.user_code);
                    } else {
                        scope.filteredPortfoliosList = scope.portfoliosList
                          .filter(portfolio => scope.reportOptions?.portfolios.includes(portfolio.id))
                          .map(portfolio => portfolio.user_code);
                    }

                    if (!scope.filteredPortfoliosList?.length) {
                        return;
                    }

                    let options = {
                        portfolios: scope.filteredPortfoliosList,
                        report_date: scope.reportOptions?.report_date
                    };

                    if (scope.entityType === "pl-report" && (scope.reportOptions?.pl_first_date || scope.reportOptions?.begin_date)) {
                        let optionsPlFirstDate = {
                            portfolios: scope.filteredPortfoliosList,
                            report_date: scope.reportOptions?.pl_first_date || plFirstDateForStatus
                        };

                        Promise.all([
                            portfolioReconcileHistoryService.check(options),
                            portfolioReconcileHistoryService.check(optionsPlFirstDate)
                        ])
                          .then(([res1, res2]) => {
                              let mergedResults = { ...res1 || {}, ...res2 || {} };

                              // Filter out only failed statuses (not "ok")
                              scope.failedReconcileData.results = Object.fromEntries(
                                Object.entries(mergedResults).filter(([key, data]) => data.final_status.toLowerCase() !== "ok")
                              );

                              // Count only failed ones (not "ok")
                              scope.failedReconcileData.count = Object.values(mergedResults)
                                .filter(data => data.final_status.toLowerCase() !== "ok")
                                .length;

                          })
                          .catch(error => {
                              console.error('failed Reconcile P&L Status Data error:', error);
                          });

                    } else if (scope.entityType === "balance-report") {
                        portfolioReconcileHistoryService.check(options)
                          .then(res => {
                              // Filter out only failed statuses (not "ok")
                              scope.failedReconcileData.results = Object.fromEntries(
                                Object.entries(res || {}).filter(([key, data]) => data.final_status.toLowerCase() !== "ok")
                              );

                              // Count only failed ones (not "ok")
                              scope.failedReconcileData.count = Object.values(res)
                                .filter(data => data.final_status.toLowerCase() !== "ok")
                                .length;
                          })
                          .catch(error => {
                              console.error('failed Reconcile Balance Status Data error:', error);
                          });
                    }
                }

                function fetchInceptionDate() {
                    if((scope.entityType === 'pl-report' || scope.entityType === 'transaction-report') &&
                      scope.reportLayoutOptions?.datepickerOptions?.reportFirstDatepicker?.datepickerMode === 'inception' )
                    {
                        const earliestDate = getFilteredEarliestDate();
                        if (earliestDate) {
                            if ('pl_first_date' in scope.reportOptions && 'begin_date' in scope.reportOptions) {
                                scope.reportOptions.pl_first_date = earliestDate;
                                scope.reportOptions.begin_date = earliestDate;
                            } else if ('pl_first_date' in scope.reportOptions) {
                                scope.reportOptions.pl_first_date = earliestDate;
                            } else if ('begin_date' in scope.reportOptions) {
                                scope.reportOptions.begin_date = earliestDate;
                            }
                            scope.datesData.from = earliestDate;

                            setTimeout(function () {
                                scope.$apply();
                            }, 200)
                        }
                    }
                }

                var initEventListeners = function () {

                    scope.evEventService.addEventListener(evEvents.LAYOUT_NAME_CHANGE, function () {

                        listLayout = scope.evDataService.getListLayout();

                        if (listLayout && listLayout.name) {
                            scope.layoutData.name = listLayout.name;
                        }

                    });

                    scope.evEventService.addEventListener(evEvents.MISSING_PRICES_LOAD_END, function () {

                        scope.missingPricesData = scope.evDataService.getMissingPrices()

                        getReconcileStatus();

                    });

                    if (scope.isReport) {

                        scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                            scope.reportOptions = scope.evDataService.getReportOptions();
                            scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                            if (dateFromKey) {
                                scope.datesData.from = scope.reportOptions[dateFromKey];
                            }

                            scope.datesData.to = scope.reportOptions[dateToKey];

                            if(scope.reportOptions.pl_first_date) {
                                scope.reportOptions.begin_date = scope.reportOptions.pl_first_date;
                                scope.reportOptions.end_date = scope.reportOptions.report_date;
                            }

                            if( scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker?.periodType) {
                                scope.reportOptions.period_type = scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.periodType;
                                delete scope.reportOptions.begin_date;
                            } else {
                                delete scope.reportOptions.period_type;
                            }

                            if(scope.reportOptions.period_type && scope.reportOptions.period_type === 'daily') {
                                plFirstDateForStatus = scope.reportOptions.pl_first_date || scope.reportOptions.begin_date;
                                delete scope.reportOptions.pl_first_date;
                                delete scope.reportOptions.begin_date;
                            }

                            fetchInceptionDate();
                            getReconcileStatus();
                        });

                        scope.evEventService.addEventListener(evEvents.FINISH_RENDER, function () {
                            fetchInceptionDate();
                        });
                    }

                    getPortfolios()
                      .then(() => {
                          fetchInceptionDate();
                          getReconcileStatus();
                      })
                      .catch((error) => {
                          console.log('Error in getPortfolios: ', error);
                      });

                };

                const init = function () {

                    scope.missingPricesData = scope.evDataService.getMissingPrices()

                    if (scope.isReport) {

                        getCurrencies();

                        prepareReportLayoutOptions();

                        [dateFromKey, dateToKey] = reportHelper.getDateProperties(scope.entityType);

                        scope.datesData = {
                            to: scope.reportOptions[dateToKey]
                        };

                        if (dateFromKey) scope.datesData.from = scope.reportOptions[dateFromKey];

                    }

                    initEventListeners();
                };

                init();

            },
        }
    }
}());