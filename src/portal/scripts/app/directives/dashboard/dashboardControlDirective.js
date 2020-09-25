(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var metaContentTypeService = require('../../services/metaContentTypesService');

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var uiService = require('../../services/uiService');


    module.exports = function () {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-control-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.fields = [];
                scope.entityType = null;

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

                        entityResolverService.getList(scope.entityType, options).then(function (data) {

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

                    return new Promise (function (resolve, reject) {
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

                    scope.item.data.store.value = null;
                    scope.item.data.store.name = '';
                    scope.valueChanged()

                };

                scope.initEventListeners = function(){

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        }

                    });

                };

                var getItemDataStore = function (componentData) {

                    var promisify = function (value) {
                        return new Promise(function (resolve) {
                            return resolve(value);
                        });
                    };

                    if (scope.item.data.store && scope.item.data.store.value) { // Value already exist, default value don't need
                        return promisify(scope.item.data.store);
                    }

                    if (!componentData.settings.defaultValue) {
                        return promisify({});
                    }

                    var mode = componentData.settings.defaultValue.mode;

                    if (mode === 1) { // Set default value
                        var value = componentData.settings.defaultValue.setValue;
                        var name = componentData.settings.defaultValue.setValueName;
                        var label = componentData.settings.defaultValue.setValueLabel;

                        return promisify({value: value, name: name, label: label});
                    }

                    if (mode === 0) { // Get default value from report

                        var layoutId = componentData.settings.defaultValue.layout;

                        return uiService.getListLayoutByKey(layoutId).then(function (layout) {

                            var key = componentData.settings.defaultValue.reportOptionsKey;
                            var value = layout.data.reportOptions[key];

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

                        });
                    }

                    return promisify({});

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

                scope.init = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);
                    scope.entityType = scope.getEntityTypeByContentType(scope.componentData.settings.content_type);

                    if (scope.entityType) {

                        scope.getData()
                            .then(function() {

                                scope.settingUpDefaultValue(scope.componentData);

                            });

                    } else {

                        scope.settingUpDefaultValue(scope.componentData);

                    }

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

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