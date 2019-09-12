/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');
    var attributeTypeService = require('../services/attributeTypeService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/bind-field-control-view.html',
            scope: {
                item: '=',
                entity: '=',
                entityType: '='
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {classifier: false};

                var attrs = scope.$parent.vm.attrs || [];
                var userInputs = scope.$parent.vm.userInputs || [];
                var choices = metaService.getValueTypes() || [];
                var entityAttrs = metaService.getEntityAttrs(scope.entityType) || [];

                scope.layoutAttrs = layoutService.getLayoutAttrs();

                scope.isRecalculate = false;

                scope.isNotEditableField = function () {
                    console.log('editable entityType', scope.entityType, scope.item);
                    if (scope.entityType === 'transaction-type' || scope.entityType === 'complex-transaction') {

                        if (scope.item.can_recalculate || !scope.item.editable) {
                            return true;
                        };

                    };

                    return false;
                };

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

                }

                scope.getName = function () {

                    if (scope.item.hasOwnProperty('verbose_name')) {
                        return scope.item.verbose_name;
                    }

                    if (scope.item.options && scope.item.options.fieldName) {
                        return scope.item.options.fieldName;
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
                                result = scope.item.attribute_type_object.name
                            } else {
                                result = scope.item.name
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

                scope.setDateToday = function () {
                    scope.entity[scope.getModelKey()] = moment(new Date()).format('YYYY-MM-DD');
                };

                scope.setDatePlus = function () {
                    scope.entity[scope.getModelKey()] = moment(new Date(scope.entity[scope.getModelKey()])).add(1, 'days').format('YYYY-MM-DD');
                };

                scope.setDateMinus = function () {
                    scope.entity[scope.getModelKey()] = moment(new Date(scope.entity[scope.getModelKey()])).subtract(1, 'days').format('YYYY-MM-DD');
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

                if (scope.fieldType && scope.fieldType.value === 30) {

                    if (scope.entity) {

                        scope.classifierId = scope.entity[scope.getModelKey()];

                        scope.findNodeItem().then(function () {
                            scope.$apply();
                        })
                    }
                }

                scope.changeClassifier = function () {
                    if (classifierTree) {
                        console.log('classifier id', scope.entity[scope.getModelKey()]);
                        scope.classifierId = scope.entity[scope.getModelKey()];

                        scope.findNodeItem().then(function () {
                            classifierTree.classifiers.forEach(findNodeInChildren);
                            scope.$apply();
                        })
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
                    ;

                    if (scope.item.options) { // for date specific buttons

                        var optionsKeys = Object.keys(scope.item.options);

                        if (optionsKeys && optionsKeys.length > 0) {

                            optionsKeys.forEach(function (key) {
                                if (scope.item.options[key]) {
                                    buttonsCount = buttonsCount + 1;
                                }
                            });

                        }
                        ;

                    }
                    ;

                    if (scope.item.buttons && scope.item.buttons.length > 0) {

                        buttonsCount = buttonsCount + scope.item.buttons.length;

                    }
                    ;

                    if (buttonsCount > 0) {
                        styleValue = 'padding-right: ' + (buttonsCount * 34) + 'px; ';
                    }
                    ;

                    // ----------------------- Background Color -----------------

                    if (scope.item.backgroundColor) {
                        styleValue = styleValue + 'background-color: ' + scope.item.backgroundColor + ';';
                    }
                    ;

                    return styleValue;
                };

                /*scope.styleForDateInputContainer = function () {
                    var styleValue = '';

                    if (scope.item.options) {

                        var optionsKeys = Object.keys(scope.item.options);

                        var optionButtonsCount = 0;

                        if (optionsKeys && optionsKeys.length > 0) {

                            optionsKeys.forEach(function (key) {
                                if (scope.item.options[key]) {
                                    optionButtonsCount = optionButtonsCount + 1;
                                }
                            });

                            if (optionButtonsCount > 0) {
                                styleValue = 'padding-right: ' + (optionButtonsCount * 34) + 'px;';
                            }

                        }

                    }

                    return styleValue;
                };

                scope.styleForInputWithButtons = function () {

                    var styleValue = '';

                    if (scope.item.buttons && scope.item.buttons.length > 0) {
                        styleValue = 'width: ' + (100 - scope.item.buttons.length * 10) + '%;';
                    }

                    if (scope.item.backgroundColor) {

                        if (styleValue) {
                            styleValue = styleValue + ' ';
                        }

                        styleValue = styleValue + 'background-color: ' + scope.item.backgroundColor + ';'
                    }

                    return styleValue;

                };*/

                scope.inputBackgroundColor = function () {
                    var backgroundColor = '';

                    if (scope.item.backgroundColor) {
                        backgroundColor = 'background-color: ' + scope.item.backgroundColor + ';';
                    }

                    return backgroundColor;
                };

                scope.openCalculatorDialog = function ($event) {

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

                        }
                        ;

                    });

                };

            }
        }
    }

}());