(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var metaContentTypeService = require('../../services/metaContentTypesService');
	var expressionsService = require('../../services/expression.service');

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
	var directivesEvents = require('../../services/events/directivesEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');
	var reportHelper = require('../../helpers/reportHelper');

    var EventService = require('../../services/eventService');
    var uiService = require('../../services/uiService');


    module.exports = function () {
        return {
            restriction: 'E',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
			templateUrl: 'views/directives/dashboard/dashboard-control-view.html',
            link: function (scope, elem, attr) {

                scope.fields = [];
                scope.entityType = null;
                scope.readyStatus = {
                	componentWidthCalculated: false
				};

                scope.attribute = {
                    key: 'value'
                }

				var dashboardControlElem = elem[0].querySelector(".dashboardControl");
				var cellWidth;

                scope.getEntityTypeByContentType = function (contentType) {

                    /*if (contentType === 'instruments.instrument') {
                        return 'instrument'
                    }

                    if (contentType === 'portfolios.portfolio') {
                        return 'portfolio'
                    }

                    if (contentType === 'accounts.account') {
                        return 'account'
                    }

                    if (contentType === 'currencies.currency') {
                        return 'currency'
                    }

                    if (contentType === 'instruments.pricingpolicy') {
                        return 'pricing-policy'
                    }*/

                    return metaContentTypeService.findEntityByContentType(contentType);

                };

                scope.getData = function () {

                    var options = {
                        pageSize: 1000,
                        page: 1
                    }

                    var fields = [];

                    var getEntitiesMethod = function (resolve, reject) {

                        entityResolverService.getListLight(scope.entityType, options).then(function (data) {

                            //scope.fields = data.results;
                            fields = fields.concat(data.results);

                            if (data.next) {

                                options.page += 1;
                                getEntitiesMethod(resolve, reject);

                            } else {

                                scope.fields = fields;

                                scope.$apply(function () {

                                    setTimeout(function () {
                                        $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                            ev.stopPropagation();
                                        });
                                    }, 100);

                                });

                                resolve();
                            }

                        }).catch(function (error) {
                            reject(error);
                        });

                    }

                    return new Promise(function (resolve, reject) {
                        getEntitiesMethod(resolve, reject);
                    })

                };

                scope.getDataForMultiselect = function () {
                    return entityResolverService.getList(scope.entityType);
                };


                scope.valueChanged = function () {

                    console.log('valueChanged', scope.item.data.store);
                    console.log('valueChanged.value', scope.item.data.store.value);

                    var componentsOutputs = scope.dashboardDataService.getAllComponentsOutputs();
                    var compsKeys = Object.keys(componentsOutputs);

                    if (compsKeys.length > 0) {

                        compsKeys.forEach(function (compKey) {
                            if (componentsOutputs[compKey]) {
                                componentsOutputs[compKey].changedLast = false;
                            }
                        });

                        scope.dashboardDataService.setAllComponentsOutputs(componentsOutputs);

                    }

                    var changedData = {
                        changedLast: true,
                        name: scope.componentData.name,
                        data: null
                    };

                    if (scope.item.data.store) {
                        changedData.data = JSON.parse(JSON.stringify(scope.item.data.store));
                    }

                    scope.dashboardDataService.setComponentOutput(scope.item.data.id, changedData);
                    scope.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + scope.item.data.id);

                    /*if (scope.componentData.settings.auto_refresh) {
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)
                    }*/
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_CHANGE);

                };

                scope.clearValue = function () {

                    scope.item.data.store.value = scope.componentData.settings.multiple ? [] : null;
                    scope.item.data.store.name = '';
                    scope.valueChanged()

                };

                scope.initEventListeners = function () {

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        }

                    });

                    if (scope.componentData.settings.multiple) {

                    	scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENTS_SIZES_CHANGED, function () {

							var componentUIData = scope.dashboardDataService.getComponentUIData(scope.item.data.id);

							if (componentUIData && componentUIData.width !== undefined && componentUIData.width !== null) {
								dashboardControlElem.style.width = componentUIData.width;
								scope.readyStatus.componentWidthCalculated = true; // needed so that multiselector chips can get actual component width
							}

							scope.multiselectEventService.dispatchEvent(directivesEvents.CHIPS_LIST_ELEMENT_SIZE_CHANGED);

						});

					}

                };

				var reportDateKeys = ['report_date', 'pl_first_date', 'begin_date', 'end_date'];

				var getReportOptionsValue = function (layout, key) {

					var rlOptions = layout.data.reportLayoutOptions;

					/* if (rlOptions && rlOptions.datepickerOptions && reportDateKeys.indexOf(key) > -1) {

						var dateFrom = reportDateKeys.indexOf(key) < 2;
						var dateExpr = rlOptions.datepickerOptions.reportFirstDatepicker.expression;

						if (dateFrom) {
							dateExpr = rlOptions.datepickerOptions.reportFirstDatepicker.expression;

						} else {
							dateExpr = rlOptions.datepickerOptions.reportLastDatepicker.expression;
						}

						if (dateExpr) {

							return new Promise(function (resolve) {

								expressionsService.getResultOfExpression({'expression': dateExpr}).then(function (data) {
									resolve(data.result)

								}).catch(function (error) {
									console.error('Error occurred while trying to evaluate: ' + dateExpr, error);
									resolve(null);
								});

							});

						}

					} */
					if (rlOptions && reportDateKeys.indexOf(key) > -1) {
						return reportHelper.getReportDate(layout.data.reportOptions, layout.data.reportLayoutOptions, key);
					}

					return new Promise(function (resolve) {
						resolve(layout.data.reportOptions[key]);
					});

				};

				var formatValueForDataStore = function (value, componentData) {

					if (!value) {
						return {};
					}

					if (componentData.settings.multiple) {

						return Array.isArray(value) ? {value: value} : {value: [value]};

					}

					if (componentData.settings.value_type === 100) {

						value = Array.isArray(value) ? value[0] : value;

						var selectedRelation = scope.fields.find(function (field) {

							return field.id === value;

						});

						if (selectedRelation) {

							return {value: value, name: selectedRelation.name};

						}

						return {};

					}

					return Array.isArray(value) ? {value: value[0]} : {value: value};

				};

				var resolveValueFromReportLayout = function (layoutData, componentData, resolve) {

					/* var layout;

					if (layoutData.results) {

						layout = layoutData.results.find(function (item) {
							return item.user_code === user_code
						})

					} */

					if (layoutData.results && layoutData.results[0]) {

						var layout = layoutData.results[0];
						var key = componentData.settings.defaultValue.reportOptionsKey;
						// var value = layout.data.reportOptions[key];
						getReportOptionsValue(layout, key).then(function (value) {
							value = formatValueForDataStore(value, componentData);
							resolve(value);
						});

					} else {
						resolve({});
					}

				};

                var getItemDataStore = function (componentData) {

                    if (scope.componentData.custom_component_name) {
                        scope.customName = scope.componentData.custom_component_name;
                    }

                    var promisify = function (value) {
                        return new Promise(function (resolve) {
                            return resolve(value);
                        });
                    };

                    var mode;

                    /*if (!componentData.settings.defaultValue) {
                        return promisify({});
                    }*/

                    if (componentData.settings.defaultValue) {
                        mode = componentData.settings.defaultValue.mode;
                    }

                    if (mode === 1) { // Set default value

                        var value = componentData.settings.defaultValue.setValue;
                        const values = componentData.settings.multiple ? value : [value];
                        var name = componentData.settings.defaultValue.setValueName;
                        var label = componentData.settings.defaultValue.setValueLabel;

                        if (componentData.settings.value_type === 100) {

                            return entityResolverService.getListLight(scope.entityType, /*{ // fix bug multiple select
                                filters: {
                                    user_code: value
                                }
                            }*/).then(function (data){

                                var result;

                                if(data.results) {
                                    if (componentData.settings.multiple) { // fix bug multiple select

                                        result = data.results.filter(item => values.includes(item.id));

                                        if (result.length > 0) {
                                            return promisify({value: result.map(({id}) => id), name: name, label: label});
                                        } else {
                                            return promisify([]);
                                        }

                                    } else {

                                        result = data.results.find(function(item){
                                            return item.user_code === value;
                                        })

                                        if (result) {
                                            return promisify({value: result.id, name: name, label: label});
                                        } else {
                                            return promisify({});
                                        }

                                    }

                                }
                            })

                        } else {

                            return promisify({value: value, name: name, label: label});
                        }
                    }
                    else if (mode === 0) { // Get default value from report

                        var user_code = componentData.settings.defaultValue.layout;
                        var entityType = componentData.settings.defaultValue.entity_type;

						return new Promise(function (resolve) {

							uiService.getListLayout(entityType, {
								filters: {
									user_code: user_code
								}
							}).then(function (data) {

								resolveValueFromReportLayout(data, componentData, resolve);

							}).catch(function (error) {
								console.error(error);
								resolve({});
							});

						});

                    }
                    else {

                        // return promisify({});

                        // if value saved inside dashboard layout, return it
                        if (scope.item.data.store && scope.item.data.store.value) {

                            var isNotArray = !Array.isArray(scope.item.data.store.value);

                            if (isNotArray || scope.item.data.store.value.length > 0) {
                                return promisify(scope.item.data.store);
                            }

                        }

                        return promisify({});

                    }

                };

                scope.settingUpDefaultValue = function (componentData) {

                    getItemDataStore(componentData).then(function (store) {

                        if (!store.value) {
                            return;
                        }

                        scope.item.data.store = store;
                        scope.$apply();
                        scope.valueChanged();
                    });

                };

                scope.setDateToday = function () {
                    scope.item.data.store.value = moment(new Date()).format(
                        "YYYY-MM-DD"
                    );
                };

                scope.setDatePlus = function () {
                    scope.item.data.store.value = moment(
                        new Date(scope.item.data.store.value)
                    )
                        .add(1, "days")
                        .format("YYYY-MM-DD");
                };

                scope.setDateMinus = function () {
                    scope.item.data.store.value = moment(
                        new Date(scope.item.data.store.value)
                    )
                        .subtract(1, "days")
                        .format("YYYY-MM-DD");
                };

                scope.init = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);
                    scope.entityType = scope.getEntityTypeByContentType(scope.componentData.settings.content_type);

                    scope.buttons = [];

                    if (scope.componentData.settings.value_type === 40) {

                        scope.buttons.push({
                            iconObj: {type: "angular-material", icon: "add"},
                            tooltip: "Increase by one day",
                            classes: "date-input-specific-btns",
                            action: {callback: scope.setDatePlus},
                        });

                        scope.buttons.push({
                            iconObj: {type: "angular-material", icon: "radio_button_unchecked"},
                            tooltip: "Set today's date",
                            classes: "date-input-specific-btns",
                            action: {callback: scope.setDateToday},
                        });

                        scope.buttons.push({
                            iconObj: {type: "angular-material", icon: "remove"},
                            tooltip: "Decrease by one day",
                            classes: "date-input-specific-btns",
                            action: {callback: scope.setDateMinus},
                        });

                    }

					if (!scope.item.data.store) scope.item.data.store = {};

                    if (scope.entityType) {

                        scope.getData().then(function () {

							scope.settingUpDefaultValue(scope.componentData);
							scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
							scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        });

                    }
                    else {

                        scope.settingUpDefaultValue(scope.componentData);
                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    }

                    if (scope.componentData.settings.multiple) {

                    	/* if (!scope.item.data.store) {
							scope.item.data.store = {}
						} */

                    	if (!Array.isArray(scope.item.data.store.value)) {
							scope.item.data.store.value = [];
						}

                    	scope.multiselectEventService = new EventService();

						var componentUIData = scope.dashboardDataService.getComponentUIData(scope.item.data.id);
						var componentSizeCalculated = componentUIData && componentUIData.width;

						if (componentSizeCalculated) {
							dashboardControlElem.style.width = componentUIData.width; // needed so that multiselector chips can get actual component width
							scope.readyStatus.componentWidthCalculated = true;
						}

					} else {
						scope.readyStatus.componentWidthCalculated = true;
					}

                    if (scope.componentData.custom_component_name) {
                        scope.customName = scope.componentData.custom_component_name;
                    }

                    scope.initEventListeners();

                };

                scope.init();


            }
        }
    }
}());