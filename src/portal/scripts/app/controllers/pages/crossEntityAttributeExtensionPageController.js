/**
 * Created by szhitenev on 22.06.2020.
 */
(function () {

    var uiService = require('../../services/uiService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaService = require('../../services/metaService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function crossEntityAttributeExtensionPage($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            content: false,
            attributeTypes: false
        };

        vm.currencyAttributes = metaService.getEntityAttrs('currency')
        vm.instrumentAttributes = metaService.getEntityAttrs('instrument')

        vm.currencyAttributeTypes = [];
        vm.instrumentAttributeTypes = [];

        vm.tabs = [
            {
                name: "Balance",
                content_type: 'reports.balancereport',
                instrument_system_attributes: [],
                instrument_dynamic_attributes: [],
                currency_system_attributes: [],
                currency_dynamic_attributes: [],
            },
            {
                name: "PL",
                content_type: 'reports.plreport',
                instrument_system_attributes: [],
                instrument_dynamic_attributes: [],
                currency_system_attributes: [],
                currency_dynamic_attributes: [],
            },

        ];


        vm.getData = function () {

            vm.tabs = [
                {
                    name: "Balance",
                    content_type: 'reports.balancereport',
                    instrument_system_attributes: [],
                    instrument_dynamic_attributes: [],
                    currency_system_attributes: [],
                    currency_dynamic_attributes: [],
                },
                {
                    name: "PL",
                    content_type: 'reports.plreport',
                    instrument_system_attributes: [],
                    instrument_dynamic_attributes: [],
                    currency_system_attributes: [],
                    currency_dynamic_attributes: [],
                },

            ];


            vm.readyStatus.content = false;

            uiService.getCrossEntityAttributeExtensionList({pageSize: 1000}).then(function (data) {

                vm.readyStatus.content = true;

                vm.createDataStructure(data);

                $scope.$apply();

            });

        };

        vm.createDataStructure = function (data) {

            console.log('createDataStructure.data', data);

            console.log('createDataStructure.tabs', vm.tabs);

            console.log('createDataStructure.currencyAttributes', vm.currencyAttributes);
            console.log('createDataStructure.instrumentAttributes', vm.instrumentAttributes);

            console.log('createDataStructure.currencyAttributeTypes', vm.currencyAttributeTypes);
            console.log('createDataStructure.instrumentAttributeTypes', vm.instrumentAttributeTypes);

            vm.tabs.forEach(function (tab) {

                // Creating Instrument System Attribute

                vm.instrumentAttributes.forEach(function (item) {

                    tab.instrument_system_attributes.push({

                        context_content_type: tab.content_type,
                        content_type_from: "instruments.instrument",
                        content_type_to: "currencies.currency",
                        key_from: item.key,
                        value_type: item.value_type,
                        name: item.name,
                        key_to: null,
                        value_to: null

                    })

                })

                // Creating Instrument Dynamic Attribute

                vm.instrumentAttributeTypes.forEach(function (item) {


                    tab.instrument_dynamic_attributes.push({

                        context_content_type: tab.content_type,
                        content_type_from: "instruments.instrument",
                        content_type_to: "currencies.currency",
                        key_from: item.key,
                        value_type: item.value_type,
                        name: item.name,
                        key_to: null,
                        value_to: null

                    })

                })

                // Creating Currency System Attribute

                vm.currencyAttributes.forEach(function (item) {

                    tab.currency_system_attributes.push({

                        context_content_type: tab.content_type,
                        content_type_from: "currencies.currency",
                        content_type_to: "instruments.instrument",
                        key_from: item.key,
                        value_type: item.value_type,
                        name: item.name,
                        key_to: null,
                        value_to: null

                    })

                })

                // Creating Currency Dynamic Attribute

                vm.currencyAttributeTypes.forEach(function (item) {

                    tab.currency_dynamic_attributes.push({

                        context_content_type: tab.content_type,
                        content_type_from: "currencies.currency",
                        content_type_to: "instruments.instrument",
                        key_from: item.key,
                        value_type: item.value_type,
                        name: item.name,
                        key_to: null,
                        value_to: null

                    })

                })


            })


            function mapTabItem(tabItem) {

                data.results.forEach(function (item) {

                    if (tabItem.context_content_type === item.context_content_type) {

                        if (tabItem.content_type_from === item.content_type_from) {

                            if (tabItem.content_type_to === item.content_type_to) {

                                if (tabItem.key_from === item.key_from) {

                                    tabItem.id = item.id;
                                    tabItem.key_to = item.key_to;
                                    tabItem.value_to = item.value_to;

                                }


                            }

                        }

                    }


                })

            }

            if (data.results) {

                vm.tabs.forEach(function (tab) {

                    tab.instrument_system_attributes.forEach(mapTabItem)
                    tab.instrument_dynamic_attributes.forEach(mapTabItem)

                    tab.currency_system_attributes.forEach(mapTabItem)
                    tab.currency_dynamic_attributes.forEach(mapTabItem)

                })

            }

        }

        vm.getAttributeTypes = function () {

            return new Promise(function (resolve, reject) {

                var promises = [];

                promises.push(new Promise(function (resolve, reject) {

                    console.log('Requesting instrument attribute types');

                    try {

                        attributeTypeService.getList('instrument', {pageSize: 1000}).then(function (data) {

                            vm.instrumentAttributeTypes = data.results.map(function (item) {

                                item.key = 'attributes.' + item.user_code;

                                if (item.value_type === 30) {
                                    item.value_type = 10
                                }

                                return item
                            });

                            resolve();

                        })

                    } catch (error) {

                        console.log('error', error);

                        resolve()
                    }

                }))

                promises.push(new Promise(function (resolve, reject) {

                    console.log('Requesting currency attribute types');

                    try {

                        attributeTypeService.getList('currency', {pageSize: 1000}).then(function (data) {

                            vm.currencyAttributeTypes = data.results.map(function (item) {

                                if (item.value_type === 30) {
                                    item.value_type = 10
                                }

                                item.key = 'attributes.' + item.user_code;

                                return item
                            });

                            resolve();

                        })

                    } catch (error) {

                        console.log('error', error);

                        resolve()
                    }

                }))

                Promise.all(promises).then(function (value) {

                    vm.readyStatus.attributeTypes = true;

                    $scope.$apply();

                    resolve()

                })

            })


        };

        vm.save = function () {

            var promises = [];

            function handleTabItem(item) {

                promises.push(new Promise(function (resolve, reject) {

                    if (item.key_to || item.value_to) {

                        if (item.id) {

                            uiService.updateCrossEntityAttributeExtension(item.id, item).then(function (data) {
                                resolve(data)
                            })

                        } else {

                            uiService.createCrossEntityAttributeExtension(item).then(function (data) {
                                resolve(data)
                            })

                        }

                    }

                }))

            }

            vm.tabs.forEach(function (tab) {

                tab.instrument_system_attributes.forEach(handleTabItem);
                tab.instrument_dynamic_attributes.forEach(handleTabItem);

                tab.currency_system_attributes.forEach(handleTabItem);
                tab.currency_dynamic_attributes.forEach(handleTabItem);

            });

            Promise.all(promises).then(function (data) {

                vm.getData();

                toastNotificationService.success('Success. Changes have been saved');


            }).catch(function (error) {

                toastNotificationService.error('Error. Error occurred while trying to save tooltips');

            });

        };

        vm.init = function () {


            vm.getAttributeTypes().then(function () {

                vm.getData();

            })

        };

        vm.init();
    }

}());