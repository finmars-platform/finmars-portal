/**
 * Created by mevstratov on 18.01.2020.
 */
(function () {

    'use strict';

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');
    var evEditorEvents = require('../../services/ev-editor/entityViewerEditorEvents');

    var gridHelperService = require('../../services/gridHelperService');
    var attributeTypeService = require('../../services/attributeTypeService');

    var transactionTypeService = require('../../services/transactionTypeService');
    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');

    var EntityViewerEditorEventService = require("../../services/ev-editor/entityViewerEditorEventService");
    var EntityViewerEditorDataService = require("../../services/ev-editor/entityViewerEditorDataService");

    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var transactionHelper = require('../../helpers/transaction.helper');

    module.exports = function ($scope, $mdDialog, inputFormTabs, data) {

        var vm = this;

        vm.entityType = data.entityType;

        vm.entity = {$_isValid: true};

        vm.tabs = inputFormTabs;

        vm.readyStatus = {content: false, entity: true, transactionTypes: false, layout: false};


        vm.attrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.range = gridHelperService.range;

        vm.transactionTypeId = data.transactionTypeId;

        vm.attributesLayout = [];

        let dataConstructorLayout = [];
        let inputsWithCalculations;

        var mapAttributesToLayoutFields = function () {

            var attributes = {
                entityAttrs: vm.entityAttrs,
                dynamicAttrs: vm.attrs,
                layoutAttrs: vm.layoutAttrs,
                userInputs: vm.userInputs
            };

            var attributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(vm.tabs, attributes, dataConstructorLayout, true);

            vm.attributesLayout = attributesLayoutData.attributesLayout;

            if (vm.fixedArea && vm.fixedArea.isActive) {
                var fixedAreaAttributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(vm.fixedArea, attributes, dataConstructorLayout, true);

                vm.fixedAreaAttributesLayout = fixedAreaAttributesLayoutData.attributesLayout;
            }

        };

        var mapAttributesAndFixFieldsLayout = function () {
            mapAttributesToLayoutFields();
        };

        var postBookComplexTransactionActions = function (transactionData, recalculationInfo) {
            // ng-repeat with bindFieldControlDirective may not update without this
            vm.tabs = {};
            vm.fixedArea = {};
            // < ng-repeat with bindFieldControlDirective may not update without this >

            if (Array.isArray(transactionData.book_transaction_layout.data)) {
                vm.tabs = transactionData.book_transaction_layout.data;

            } else {
                vm.tabs = transactionData.book_transaction_layout.data.tabs;
                vm.fixedArea = transactionData.book_transaction_layout.data.fixedArea;

            }

            dataConstructorLayout = JSON.parse(JSON.stringify(transactionData.book_transaction_layout)); // unchanged layout that is used to remove fields without attributes

            vm.userInputs = [];
            transactionHelper.updateTransactionUserInputs(vm.userInputs, vm.tabs, vm.fixedArea, vm.transactionType);

            inputsWithCalculations = transactionData.transaction_type_object.inputs;

            if (inputsWithCalculations) {
                inputsWithCalculations.forEach(function (inputWithCalc) {

                    vm.userInputs.forEach(function (userInput) {
                        if (userInput.name === inputWithCalc.name) {

                            if (!userInput.buttons) {
                                userInput.buttons = [];
                            }

                            if (inputWithCalc.can_recalculate === true) {
                                userInput.buttons.push({
                                    iconObj: {type: 'fontawesome', icon: 'fas fa-redo'},
                                    tooltip: 'Recalculate this field',
                                    caption: '',
                                    classes: '',
                                    action: {
                                        key: 'input-recalculation',
                                        callback: vm.recalculate,
                                        parameters: {inputs: [inputWithCalc.name], recalculationData: 'input'}
                                    }
                                })
                            }

                            if (inputWithCalc.settings && inputWithCalc.settings.linked_inputs_names) {
                                var linkedInputsList = inputWithCalc.settings.linked_inputs_names.split(',');

                                userInput.buttons.push({
                                    iconObj: {type: 'fontawesome', icon: 'fas fa-sync-alt'},
                                    tooltip: 'Recalculate linked fields',
                                    caption: '',
                                    classes: '',
                                    action: {
                                        key: 'linked-inputs-recalculation',
                                        callback: vm.recalculate,
                                        parameters: {inputs: linkedInputsList, recalculationData: 'linked_inputs'}
                                    }
                                })
                            }

                            if (recalculationInfo && recalculationInfo.recalculatedInputs.indexOf(userInput.name) > -1) { // mark userInputs that were recalculated
                                userInput.frontOptions.recalculated = recalculationInfo.recalculationData;
                            }

                        }
                    })

                });
            }


            mapAttributesAndFixFieldsLayout();

        };

        var bookComplexTransaction = function (inputsToRecalculate, recalculationData) {

            vm.processing = true;

            var values = {};

            vm.userInputs.forEach(function (item) {
                values[item.name] = vm.entity[item.name]
            });

            var book = {
                transaction_type: vm.entity.transaction_type,
                recalculate_inputs: inputsToRecalculate,
                process_mode: 'recalculate',
                values: values
            };

            transactionTypeService.bookComplexTransaction(book.transaction_type, book).then(function (data) {

                vm.transactionTypeId = data.transaction_type;
                vm.editLayoutEntityInstanceId = data.transaction_type;

                vm.entity = data.complex_transaction;

                vm.transactionType = data.transaction_type_object;

                vm.specialRulesReady = true;
                vm.readyStatus.entity = true;

                var keys = Object.keys(data.values);

                keys.forEach(function (key) {
                    vm.entity[key] = data.values[key];
                });

                data.complex_transaction.attributes.forEach(function (item) {
                    if (item.attribute_type_object.value_type === 10) {
                        vm.entity[item.attribute_type_object.name] = item.value_string;
                    }
                    if (item.attribute_type_object.value_type === 20) {
                        vm.entity[item.attribute_type_object.name] = item.value_float;
                    }
                    if (item.attribute_type_object.value_type === 30) {
                        vm.entity[item.attribute_type_object.name] = item.classifier;
                    }
                    if (item.attribute_type_object.value_type === 40) {
                        vm.entity[item.attribute_type_object.name] = item.value_date;
                    }
                });


                var recalculationInfo = {
                    recalculatedInputs: inputsToRecalculate,
                    recalculationData: recalculationData
                }


                postBookComplexTransactionActions(data, recalculationInfo);


                vm.processing = false;

                $scope.$apply();

                if (recalculationInfo.recalculatedInputs && recalculationInfo.recalculatedInputs.length) {
                    vm.evEditorEventService.dispatchEvent(evEditorEvents.FIELDS_RECALCULATED);
                }

            }).catch(function (reason) {

                console.log("Something went wrong with recalculation", reason);

                vm.processing = false;
                vm.readyStatus.layout = true;

                $scope.$apply();

            })

        };

        vm.recalculate = function (paramsObj) {

            var inputs = paramsObj.inputs;
            var recalculationData = paramsObj.recalculationData;

            bookComplexTransaction(inputs, recalculationData);

        };

        vm.generateAttributesFromLayoutFields = function () {

            vm.attributesLayout = [];
            var tabResult;
            var fieldResult;
            var i, l, e, u;

            vm.tabs.forEach(function (tab) {

                tabResult = [];

                tab.layout.fields.forEach(function (field) {

                    fieldResult = {};

                    if (field && field.type === 'field') {

                        if (field.attribute_class === 'attr') {

                            for (i = 0; i < vm.attrs.length; i = i + 1) {

                                if (field.key) {

                                    if (field.key === vm.attrs[i].user_code) {
                                        vm.attrs[i].options = field.options;
                                        fieldResult = vm.attrs[i];
                                    }

                                } else {

                                    if (field.attribute.user_code) {

                                        if (field.attribute.user_code === vm.attrs[i].user_code) {
                                            vm.attrs[i].options = field.options;
                                            fieldResult = vm.attrs[i];
                                        }

                                    }

                                }


                            }

                        } else {

                            var attrFound = false;

                            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                if (field.name === vm.entityAttrs[e].name) {
                                    vm.entityAttrs[e].options = field.options;
                                    fieldResult = vm.entityAttrs[e];

                                    attrFound = true;
                                    break;
                                }
                            }

                            if (!attrFound) {
                                for (u = 0; u < vm.userInputs.length; u = u + 1) {

                                    if (field.name === vm.userInputs[u].name) {
                                        vm.userInputs[u].options = field.options;
                                        fieldResult = vm.userInputs[u];

                                        attrFound = true;
                                        break;
                                    }
                                }
                            }

                            if (!attrFound) {
                                for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                                    if (field.name === vm.layoutAttrs[l].name) {
                                        vm.layoutAttrs[l].options = field.options;
                                        fieldResult = vm.layoutAttrs[l];

                                        attrFound = true;
                                        break;
                                    }
                                }
                            }

                        }

                        if (field.backgroundColor) {
                            fieldResult.backgroundColor = field.backgroundColor;
                        }

                        fieldResult.editable = field.editable;

                    }

                    tabResult.push(fieldResult)


                });

                vm.attributesLayout.push(tabResult);

            });

        };

        vm.getContextParameters = function () {

            var result = {};

            if (vm.contextData) {

                Object.keys(vm.contextData).forEach(function (key) {

                    if (key.indexOf('_object') === -1) {
                        result[key] = vm.contextData[key]
                    }

                })

            }

            return result

        };

        vm.getFormLayoutFields = function () {

            return new Promise(function (resolve, rejec) {

                vm.readyStatus.layout = false;

                var contextParameters = vm.getContextParameters();

                transactionTypeService.initBookComplexTransaction(vm.transactionTypeId, contextParameters).then(function (data) {

                    var inputsWithCalculations = data.transaction_type_object.inputs;

                    vm.entity = data.complex_transaction;

                    vm.transactionType = data.transaction_type_object;

                    vm.readyStatus.entity = true;

                    var keys = Object.keys(data.values);

                    keys.forEach(function (item) {
                        vm.entity[item] = data.values[item];
                    });

                    postBookComplexTransactionActions(data);

                    vm.userInputs = [];
                    vm.tabs.forEach(function (tab) {
                        tab.layout.fields.forEach(function (field) {
                            if (field.attribute_class === 'userInput') {
                                vm.userInputs.push(field.attribute);
                            }
                        });
                    });

                    vm.tabs = vm.tabs.map(function (item, index) {

                        item.index = index;
                        return item;

                    });

                    vm.readyStatus.layout = true;

                    resolve();

                });

            })

        };

        function getGroupsFromItems(items) {

            var groups = {};

            items.forEach(function (item) {

                if (item.group_object) {

                    if (!groups[item.group_object.id]) {
                        groups[item.group_object.id] = item.group_object;
                        groups[item.group_object.id].items = [];
                    }

                    groups[item.group_object.id].items.push(item);

                } else {

                    if (!groups['ungrouped']) {
                        groups['ungrouped'] = {name: 'Ungrouped'};
                        groups['ungrouped'].items = [];
                    }

                    groups['ungrouped'].items.push(item);

                }


            });

            var groupsList = Object.keys(groups).map(function (key) {
                return groups[key]
            });

            groupsList = groupsList.filter(function (item) {
                return !!item
            });

            return groupsList;

        }

        vm.getPortfolios = function () {

            portfolioService.getList().then(function (data) {
                vm.portfolios = data.results;
                $scope.$apply();
            });

        };

        vm.getInstrumentTypes = function () {

            instrumentTypeService.getList().then(function (data) {
                vm.instrumentTypes = data.results;
                $scope.$apply();
            });

        };

        vm.loadTransactionTypes = function () {

            var options = {
                filters: {
                    portfolio: null,
                    instrument_type: null
                },
                pageSize: 1000
            };

            return transactionTypeService.getListLight(options).then(function (data) {

                vm.transactionGroups = getGroupsFromItems(data.results);

                vm.readyStatus.transactionTypes = true;

            })

        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.readyStatus.content = true;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.transactionTypes && vm.readyStatus.layout;
        };

        vm.bindFlex = function (tab, field) {
            /*var totalColspans = 0;
            var i;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }*/
            var flexUnit = 100 / tab.layout.columns;
            return Math.floor(field.colspan * flexUnit);

        };

        vm.checkFieldRender = function (tab, row, field) {

            if (field.row === row) {
                if (field.type === 'field') {
                    return true;
                } else {

                    var spannedCols = [];
                    var itemsInRow = tab.layout.fields.filter(function (item) {
                        return item.row === row;
                    });


                    itemsInRow.forEach(function (item) {

                        if (item.type === 'field' && item.colspan > 1) {
                            var columnsToSpan = item.column + item.colspan - 1;

                            for (var i = item.column; i <= columnsToSpan; i = i + 1) {
                                spannedCols.push(i);
                            }

                        }

                    });


                    if (spannedCols.indexOf(field.column) !== -1) {
                        return false
                    }

                    return true;
                }
            }
            return false;

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        var init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.evEditorPreviewElemToResize');
            }, 100);

            var promises = [];

            vm.evEditorDataService = new EntityViewerEditorDataService();
            vm.evEditorEventService = new EntityViewerEditorEventService();

            promises.push(vm.getFormLayoutFields());
            //vm.getFormLayoutFields();

            vm.getPortfolios();
            vm.getInstrumentTypes();
            promises.push(vm.loadTransactionTypes());
            //vm.loadTransactionTypes();

            promises.push(vm.getAttributeTypes());
            //vm.getAttributeTypes();

            Promise.all(promises).then(function () {

                $scope.$apply(function () {
                    setTimeout(function () {
                        $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });
                    }, 100);
                });

            })
        };

        init();

    }

}());