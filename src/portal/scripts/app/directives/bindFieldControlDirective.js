/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');
    var attributeTypeService = require('../services/attributeTypeService');

    var renderHelper = require('../helpers/render.helper');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/bind-field-control-view.html',
            scope: {
                item: '=',
                entity: '=',
                entityType: '=',
                entityChange: '&'
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {classifier: false};
                //console.log("new inputs scope.item", scope.item);
                var attrs = scope.$parent.vm.attrs || [];
                var userInputs = scope.$parent.vm.userInputs || [];
                var choices = metaService.getValueTypes() || [];
                var entityAttrs = metaService.getEntityAttrs(scope.entityType) || [];

                /*var numberInputElem = null;
                var numberInputContainerElem = null;*/

                scope.layoutAttrs = layoutService.getLayoutAttrs();
                scope.customStyles = null;

                scope.isRecalculate = false;
                scope.numberFormat = null;

                //scope.numericInputValue = {};

                scope.isEditableField = function () {

                    if (scope.entityType === 'complex-transaction' && scope.item) {

                        if (scope.item.can_recalculate || scope.item.editable === false) {
                            return false;
                        }

                    }

                    return true;
                };

                scope.getName = function () {

                    if (scope.item.options && scope.item.options.fieldName) {
                        return scope.item.options.fieldName;
                    } else if (scope.item.hasOwnProperty('verbose_name')) {
                        return scope.item.verbose_name;
                    }

                    return scope.item.name;
                };

                scope.hideIscanceledCheckbox = function (checkboxName) {

                    if (scope.entityType === 'transaction') {

                        if (checkboxName === 'Is canceled') {
                            return false;
                        }

                        return true;

                    }

                    return true;

                };

                scope.copyFromField = function (attr) {
                    var attrObj = JSON.parse(attr);

                    if (attrObj.key) {
                        scope.entity[scope.getModelKey()] = scope.entity[attrObj.key];
                        console.log(scope.entity[scope.getModelKey()]);
                    }
                    if (attrObj.id) {
                        var resAttr = null;
                        attrs.forEach(function (item) {
                            if (item.id === attrObj.id) {
                                resAttr = item;
                            }
                        });
                        scope.entity[scope.getModelKey()] = scope.entity[resAttr.name];
                    }
                };

                scope.checkValid = function () {

                    if (scope.entity.$_isValid === false) {
                        var item = scope.entity[scope.getModelKey()];
                        if (item == null || item === '' || item === undefined) {
                            return true
                        }
                    }

                    return false

                };

                scope.getModelKey = function () {

                    var result;

                    if (scope.item) {
                        if (scope.item.hasOwnProperty('id') && scope.item.id !== null) {

                            if (scope.item.attribute_type_object) {
                                result = scope.item.attribute_type_object.user_code
                            } else {
                                result = scope.item.user_code
                            }
                        } else {
                            var l, e, u;

                            for (l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                                if (scope.item.name === scope.layoutAttrs[l].name) {

                                    result = scope.layoutAttrs[l].key;
                                }
                            }
                            for (e = 0; e < entityAttrs.length; e = e + 1) {
                                if (scope.item.name === entityAttrs[e].name) {
                                    result = entityAttrs[e].key;
                                }
                            }
                            for (u = 0; u < userInputs.length; u = u + 1) {
                                if (scope.item.name === userInputs[u].name) {
                                    result = userInputs[u].name;
                                }
                            }
                        }
                    }

                    // console.log('get model key result', result);

                    return result
                };

                scope.setDateToday = function () {
                    scope.entity[scope.getModelKey()] = moment(new Date()).format('YYYY-MM-DD');
                    scope.fieldValue = {value: scope.entity[scope.getModelKey()]};
                };

                scope.setDatePlus = function () {
                    scope.entity[scope.getModelKey()] = moment(new Date(scope.entity[scope.getModelKey()])).add(1, 'days').format('YYYY-MM-DD');
                    scope.fieldValue = {value: scope.entity[scope.getModelKey()]};
                };

                scope.setDateMinus = function () {
                    scope.entity[scope.getModelKey()] = moment(new Date(scope.entity[scope.getModelKey()])).subtract(1, 'days').format('YYYY-MM-DD');
                    scope.fieldValue = {value: scope.entity[scope.getModelKey()]};
                };

                scope.node = scope.node || null;

                function findNodeInChildren(item) {
                    if (scope.classifierId === item.id) {
                        scope.node = item;
                    } else {
                        if (item.children.length) {
                            item.children.forEach(findNodeInChildren);
                        }
                    }
                }

                var classifierTree;

                function getNode() {
                    return attributeTypeService.getByKey(scope.entityType, scope.item.id).then(function (data) {
                        classifierTree = data;
                        classifierTree.classifiers.forEach(findNodeInChildren);
                        return scope.node;
                    });
                }

                scope.findNodeItem = function () {
                    scope.readyStatus.classifier = false;
                    return new Promise(function (resolve) {
                        getNode().then(function (data) {
                            scope.readyStatus.classifier = true;
                            scope.node = data;
                            scope.entity[scope.getModelKey()] = scope.classifierId;
                            resolve(undefined)
                        });
                    })
                };

                scope.changeClassifier = function () {
                    if (classifierTree) {
                        console.log('classifier id', scope.entity[scope.getModelKey()]);
                        scope.classifierId = scope.entity[scope.getModelKey()];

                        scope.findNodeItem().then(function () {
                            classifierTree.classifiers.forEach(findNodeInChildren);
                            scope.$apply();
                        });

                        if (scope.entityChange) {
                            scope.entityChange();
                        }

                    }


                };

                scope.styleForInputsWithButtons = function () {
                    var styleValue = '';

                    // -------------------- Space For Buttons -------------------
                    var buttonsCount = 0;

                    if (scope.fieldType['display_name'] === 'Number' ||
                        scope.fieldType['display_name'] === 'Float') {
                        buttonsCount = 1;
                    }

                    if (scope.item.options) { // for date specific buttons

                        var optionsKeys = Object.keys(scope.item.options);

                        if (optionsKeys && optionsKeys.length > 0) {

                            optionsKeys.forEach(function (key) {
                                if (scope.item.options[key]) {
                                    buttonsCount = buttonsCount + 1;
                                }
                            });

                        }


                    }

                    if (scope.item.buttons && scope.item.buttons.length > 0) {

                        buttonsCount = buttonsCount + scope.item.buttons.length;

                    }

                    if (buttonsCount > 0) {
                        styleValue = 'padding-right: ' + (buttonsCount * 34) + 'px; ';
                    }

                    // ----------------------- Background Color -----------------

                    if (scope.item.backgroundColor) {
                        styleValue = styleValue + 'background-color: ' + scope.item.backgroundColor + ';';
                    }


                    return styleValue;
                };

                scope.inputBackgroundColor = function () {
                    var backgroundColor = '';

                    if (scope.item.backgroundColor) {
                        backgroundColor = 'background-color: ' + scope.item.backgroundColor + ';';
                    }

                    return backgroundColor;
                };

                /*scope.openCalculatorDialog = function ($event) {

                    var fieldModel = scope.entity[scope.getModelKey()];
                    var calculatorTitle = "Calculator for: " + scope.getName();

                    $mdDialog.show({
                        controller: 'CalculatorDialogController as vm',
                        templateUrl: 'views/dialogs/calculator-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                numberValue: fieldModel,
                                calculatorTitle: calculatorTitle
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.entity[scope.getModelKey()] = res.numberValue;
                            scope.numericInputValue.numberVal = formatNumber(res.numberValue);

                        }

                    });

                };

                var formatNumber = function (numberVal) {

                    if (scope.numberFormat) {

                        return renderHelper.formatValue({
                            value: numberVal
                        }, {
                            key: 'value',
                            report_settings: scope.numberFormat
                        });

                    } else {
                        return numberVal
                    }

                };

                scope.onNumericInputFocus = function () {
                    if (!numberIsInvalid && fieldHasValue) {
                        scope.numericInputValue.numberVal = JSON.parse(JSON.stringify(scope.entity[scope.getModelKey()]));
                    }
                };

                var fieldHasValue = true;
                var numberIsInvalid;

                scope.numericItemChange = function () {

                    numberIsInvalid = false;
                    fieldHasValue = true;
                    var changedValue = scope.numericInputValue.numberVal;

                    if (changedValue === '') {

                        scope.entity[scope.getModelKey()] = null;
                        fieldHasValue = false;

                    } else if (!isNaN(changedValue) &&
                        changedValue !== null) {

                        if (Number.isInteger(changedValue)) {
                            changedValue = parseInt(changedValue);
                        } else {
                            changedValue = parseFloat(changedValue);
                        }

                        // negative numbers processing
                        /!*if (scope.item.options.onlyPositive) {

                            if (parseFloat(changedValue) < 0) {
                                numberIsInvalid = true;
                            } else {
                                scope.entity[scope.getModelKey()] = JSON.parse(JSON.stringify(changedValue));
                            }

                        } else {

                            scope.entity[scope.getModelKey()] = JSON.parse(JSON.stringify(changedValue));
                        }*!/

                        if (parseFloat(changedValue) < 0) {

                            if (scope.numberFormat && scope.numberFormat.negative_color_format_id === 1) {
                                numberInputElem.classList.add('negative-red');
                            }

                            if (scope.item.options && scope.item.options.onlyPositive) {
                                numberIsInvalid = true;
                            } else {
                                scope.entity[scope.getModelKey()] = JSON.parse(JSON.stringify(changedValue));
                            }

                        } else {
                            numberInputElem.classList.remove('negative-red');
                            scope.entity[scope.getModelKey()] = JSON.parse(JSON.stringify(changedValue));
                        }
                        // < negative numbers processing >

                    } else {

                        numberIsInvalid = true;

                    }

                    if (numberIsInvalid) {

                        scope.entity[scope.getModelKey()] = null;
                        numberInputContainerElem.classList.add('md-input-invalid');
                        numberInputElem.classList.add('ng-invalid', 'ng-invalid-number');

                    } else {
                        numberInputContainerElem.classList.remove('md-input-invalid');
                        numberInputElem.classList.remove('ng-invalid', 'ng-invalid-number');
                    }

                    scope.itemChange();

                };

                scope.onNumericInputBlur = function () {
                    if (!numberIsInvalid && fieldHasValue) {
                        var itemNumberValue = JSON.parse(JSON.stringify(scope.entity[scope.getModelKey()]));
                        scope.numericInputValue.numberVal = formatNumber(itemNumberValue);
                    }
                };*/

                scope.init = function () {

                    var fieldKey = scope.getModelKey();

                    scope.options = {};

                    if (fieldKey === 'tags') {

                        scope.options = {
                            entityType: scope.entityType
                        }

                    } else {
                        if (metaService.getEntitiesWithSimpleFields().indexOf(scope.entityType) !== -1) {
                            scope.options = {
                                entityType: scope.entityType,
                                key: fieldKey
                            };
                        }
                    }

                    if (scope.item) {
                        scope.fieldType = null;
                        scope.attribute = scope.item;

                        if (scope.attribute && scope.attribute.can_recalculate) {
                            scope.isRecalculate = true;
                        }

                        var i;
                        for (i = 0; i < choices.length; i = i + 1) {
                            if (choices[i].value === scope.attribute['value_type']) {
                                scope.fieldType = choices[i];
                            }
                        }

                        if (scope.attribute['value_type'] === 100) {
                            scope.fieldType = choices[5]; // relation == field, backend&frontend naming conflict
                        }

                        if (scope.item.options) {

                            // prepare data for number field
                            if (scope.fieldType && scope.fieldType.value === 20) {

                                if (scope.item.options.number_format) {
                                    scope.numberFormat = scope.item.options.number_format;
                                }

                                if (scope.fieldType.value === 20) {
                                    scope.onlyPositive = scope.item.options.onlyPositive;
                                }

                            }
                            // < prepare data for number field >

                            // prepare data for date field
                            if (scope.fieldType.value === 40) {

                                if (!scope.item.buttons) {
                                    scope.item.buttons = [];
                                }

                                if (scope.item.options.dateToday) {
                                    scope.item.buttons.push({
                                        icon: '',
                                        tooltip: "Set today's date",
                                        caption: 'T',
                                        classes: 'date-input-specific-btns',
                                        action: {callback: scope.setDateToday}
                                    });
                                }

                                if (scope.item.options.dateTodayPlus) {
                                    scope.item.buttons.push({
                                        icon: '',
                                        tooltip: "Increase by one day",
                                        caption: 'T+1',
                                        classes: 'date-input-specific-btns',
                                        action: {callback: scope.setDatePlus}
                                    });
                                }

                                if (scope.item.options.dateTodayMinus) {
                                    scope.item.buttons.push({
                                        icon: '',
                                        tooltip: "Decrease by one day",
                                        caption: 'T-1',
                                        classes: 'date-input-specific-btns',
                                        action: {callback: scope.setDateMinus}
                                    });
                                }

                            }
                            // < prepare data for date field >

                        }

                        if (scope.item.buttons) {
                            scope.item.buttons.forEach(function (btnObj) {

                                if (btnObj.action.key === 'input-recalculation') {
                                    btnObj.action.parameters = {item: scope.item};
                                }

                            })
                        }

                        if (scope.item.backgroundColor) {

                            scope.customStyles = {
                                'custom-input-main-container': 'background-color: ' + scope.item.backgroundColor + ';'
                            }

                        }

                    }

                    if (scope.fieldType) {

                        if (scope.fieldType.value === 30) {

                            if (scope.entity) {

                                scope.classifierId = scope.entity[scope.getModelKey()];

                                scope.findNodeItem().then(function () {
                                    scope.$apply();
                                })
                            }

                        }

                    }

                    /*if (scope.fieldType && scope.fieldType.value === 20) {

                        scope.numericInputValue.numberVal = null;
                        setTimeout(function () {
                            numberInputContainerElem = elem[0].querySelector('.bfNumberInputContainer');
                            numberInputElem = elem[0].querySelector('.bfNumberInput');
                        }, 500);

                        if (scope.entity[scope.getModelKey()] || scope.entity[scope.getModelKey()] === 0) {

                            var itemNumberValue = JSON.parse(JSON.stringify(scope.entity[scope.getModelKey()]));
                            scope.numericInputValue.numberVal = formatNumber(itemNumberValue);

                        }

                    }*/

                    scope.fieldValue = {value: scope.entity[scope.getModelKey()]};

                };

                scope.itemChange = function(){
                    //console.log("new inputs itemChange", scope.entity[scope.getModelKey()]);
                    if (scope.entityChange) {
                        scope.entityChange();
                    }
                };

                scope.onDateChange = function () {
                    //console.log("new inputs onDateChange", scope.entity, scope.entity[scope.getModelKey()]);
                    scope.entity[scope.getModelKey()] = scope.fieldValue.value;

                    if (scope.entity[scope.getModelKey()] === "") {
                        scope.entity[scope.getModelKey()] = null;
                    }

                    scope.itemChange();

                };

                scope.onFieldChange = function () {
                    scope.entity[scope.getModelKey()] = scope.fieldValue.value;
                    //console.log("new inputs onFieldChange", scope.entity[scope.getModelKey()]);
                    scope.itemChange();
                };

                scope.init()

            }
        }
    }

}());