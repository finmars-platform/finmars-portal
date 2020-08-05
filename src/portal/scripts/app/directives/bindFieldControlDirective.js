/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var evEditorEvents = require('../services/ev-editor/entityViewerEditorEvents');

    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');
    var attributeTypeService = require('../services/attributeTypeService');

    module.exports = function () {

        return {
            restrict: 'AE',
            templateUrl: 'views/directives/bind-field-control-view.html',
            scope: {
                item: '=',
                entity: '=',
                entityType: '=',
                evEditorDataService: '=',
                evEditorEventService: '=',
                entityChange: '&?',
                onFieldBlur: '&?' // for now implemented only for textInputDirective
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {classifier: false};

                var attrs = scope.$parent.vm.attrs || [];
                var userInputs = scope.$parent.vm.userInputs || [];
                var choices = metaService.getValueTypes() || [];
                var entityAttrs = metaService.getEntityAttrs(scope.entityType) || [];

                var palettesList = [];

                /*var numberInputElem = null;
                var numberInputContainerElem = null;*/

                scope.layoutAttrs = layoutService.getLayoutAttrs();

                scope.isRecalculate = false;
                scope.numberFormat = null;
                scope.ciEventObj = {
                    event: {}
                };
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
                        scope.entity[scope.fieldKey] = scope.entity[attrObj.key];
                    }

                    if (attrObj.id) {
                        var resAttr = null;
                        attrs.forEach(function (item) {
                            if (item.id === attrObj.id) {
                                resAttr = item;
                            }
                        });
                        scope.entity[scope.fieldKey] = scope.entity[resAttr.name];
                    }
                };

                scope.checkValid = function () {

                    if (scope.entity.$_isValid === false) {
                        var item = scope.entity[scope.fieldKey];
                        if (item == null || item === '' || item === undefined) {
                            return true
                        }
                    }

                    return false

                };

                /*scope.getModelKey = function () {

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

                    return result
                };*/

                scope.getModelKey = function () {

                    if (scope.item) {
                        if (scope.item.hasOwnProperty('id') && scope.item.id !== null) {

                            if (scope.item.attribute_type_object) {
                                return scope.item.attribute_type_object.user_code;
                            } else {
                                return scope.item.user_code;
                            }

                        } else {

                            var l, e, u;

                            for (e = 0; e < entityAttrs.length; e = e + 1) {
                                if (scope.item.name === entityAttrs[e].name) {
                                    return entityAttrs[e].key;
                                }
                            }

                            for (l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                                if (scope.item.name === scope.layoutAttrs[l].name) {

                                    return scope.layoutAttrs[l].key;
                                }
                            }

                            for (u = 0; u < userInputs.length; u = u + 1) {
                                if (scope.item.name === userInputs[u].name) {
                                    return userInputs[u].name;
                                }
                            }
                        }
                    }

                    return false;

                };

                scope.setDateToday = function () {
                    scope.entity[scope.fieldKey] = moment(new Date()).format('YYYY-MM-DD');
                };

                scope.setDatePlus = function () {
                    scope.entity[scope.fieldKey] = moment(new Date(scope.entity[scope.fieldKey])).add(1, 'days').format('YYYY-MM-DD');
                };

                scope.setDateMinus = function () {
                    scope.entity[scope.fieldKey] = moment(new Date(scope.entity[scope.fieldKey])).subtract(1, 'days').format('YYYY-MM-DD');
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
                            scope.entity[scope.fieldKey] = scope.classifierId;
                            resolve(undefined)
                        });
                    })

                };

                scope.changeClassifier = function () {

                    if (classifierTree) {

                        scope.classifierId = scope.entity[scope.fieldKey];

                        scope.findNodeItem().then(function () {
                            classifierTree.classifiers.forEach(findNodeInChildren);
                            scope.$apply();

                            if (scope.entityChange) {
                                scope.entityChange({fieldKey: scope.fieldKey});
                            }
                        });

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

                    if (scope.options.backgroundColor) {
                        styleValue = styleValue + 'background-color: ' + scope.options.backgroundColor + ';';
                    }


                    return styleValue;
                };

                scope.inputBackgroundColor = function () {
                    var backgroundColor = '';

                    if (scope.options.backgroundColor) {
                        backgroundColor = 'background-color: ' + scope.options.backgroundColor + ';';
                    }

                    return backgroundColor;
                };

                /*scope.openCalculatorDialog = function ($event) {

                    var fieldModel = scope.entity[scope.fieldKey];
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

                            scope.entity[scope.fieldKey] = res.numberValue;
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
                        scope.numericInputValue.numberVal = JSON.parse(JSON.stringify(scope.entity[scope.fieldKey]));
                    }
                };

                var fieldHasValue = true;
                var numberIsInvalid;

                scope.numericItemChange = function () {

                    numberIsInvalid = false;
                    fieldHasValue = true;
                    var changedValue = scope.numericInputValue.numberVal;

                    if (changedValue === '') {

                        scope.entity[scope.fieldKey] = null;
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
                                scope.entity[scope.fieldKey] = JSON.parse(JSON.stringify(changedValue));
                            }

                        } else {

                            scope.entity[scope.fieldKey] = JSON.parse(JSON.stringify(changedValue));
                        }*!/

                        if (parseFloat(changedValue) < 0) {

                            if (scope.numberFormat && scope.numberFormat.negative_color_format_id === 1) {
                                numberInputElem.classList.add('negative-red');
                            }

                            if (scope.item.options && scope.item.options.onlyPositive) {
                                numberIsInvalid = true;
                            } else {
                                scope.entity[scope.fieldKey] = JSON.parse(JSON.stringify(changedValue));
                            }

                        } else {
                            numberInputElem.classList.remove('negative-red');
                            scope.entity[scope.fieldKey] = JSON.parse(JSON.stringify(changedValue));
                        }
                        // < negative numbers processing >

                    } else {

                        numberIsInvalid = true;

                    }

                    if (numberIsInvalid) {

                        scope.entity[scope.fieldKey] = null;
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
                        var itemNumberValue = JSON.parse(JSON.stringify(scope.entity[scope.fieldKey]));
                        scope.numericInputValue.numberVal = formatNumber(itemNumberValue);
                    }
                };*/
                var checkForNotNull = function () {

                    if (scope.item.options && scope.item.options.notNull) {
                        scope.options.notNull = true;

                    } else if (scope.item.frontOptions &&
                        (scope.item.frontOptions.notNull || scope.item.frontOptions.usedInExpr)) {

                        scope.options.notNull = true;

                    } else if (scope.item.key) {

                        var requiredAttrs = metaService.getRequiredEntityAttrs(scope.entityType);

                        if (requiredAttrs.indexOf(scope.item.key) > -1) {
                            scope.options.notNull = true;
                        }

                    }

                };

                var getFieldBackgroundColor = function () {

                    if (scope.item.backgroundColor) {

                        if (typeof scope.item.backgroundColor === 'string') { // allows old layouts keep its background color
                            scope.options.backgroundColor = scope.item.backgroundColor;

                        } else if (typeof scope.item.backgroundColor === 'object') {

                            var paletteData = scope.item.backgroundColor;
                            var paletteNotFound = true;

                            var i,a;
                            loop1: for (i = 0; i < palettesList.length; i++) {

                                if (palettesList[i].user_code === paletteData.paletteUserCode) {

                                    paletteNotFound = false;

                                    for (a = 0; a < palettesList[i].colors.length; a++) {

                                        if (palettesList[i].colors[a].order === paletteData.colorOrder) {

                                            scope.options.backgroundColor = palettesList[i].colors[a].value;
                                            break loop1;

                                        }

                                    }

                                }

                            }

                            if (paletteNotFound) { // if palette was not found, use default palette

                                loop1: for (i = 0; i < palettesList.length; i++) {

                                    if (palettesList[i].user_code === 'Default Palette') {

                                        for (a = 0; a < palettesList[i].colors.length; a++) {

                                            if (palettesList[i].colors[a].order === paletteData.colorOrder) {

                                                scope.options.backgroundColor = palettesList[i].colors[a].value;
                                                break loop1;

                                            }

                                        }

                                    }

                                }
                            }

                        }

                    }

                };

                var setItemSpecificSettings = function () {

                    if (scope.evEditorDataService) {
                        palettesList = scope.evEditorDataService.getColorPalettesList();
                    }

                    scope.fieldType = null;
                    /*scope.attribute = scope.item;

                    if (scope.attribute && scope.attribute.can_recalculate) {
                        scope.isRecalculate = true;
                    }

                    var i;
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (choices[i].value === scope.attribute['value_type']) {
                            scope.fieldType = choices[i];
                        }
                    }*/
                    if (scope.item.can_recalculate) {
                        scope.isRecalculate = true;
                    }

                    var i;
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (choices[i].value === scope.item['value_type']) {
                            scope.fieldType = choices[i];
                        }
                    }

                    if (scope.item['value_type'] === 100) {
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

                        if (scope.item.options.tooltipValue) {
                            scope.tooltipText = scope.item.options.tooltipValue;

                        } else if (scope.item.tooltip) {
                            scope.tooltipText = scope.item.tooltip;

                        } else {
                            scope.tooltipText = scope.getName();
                        }

                    }

                    getFieldBackgroundColor();

                    if (scope.options.backgroundColor) {

                        scope.customStyles = {
                            'custom-input-main-container': 'background-color: ' + scope.options.backgroundColor + ';',
                            'custom-input-custom-btns-holder': 'background-color: ' + scope.options.backgroundColor + ';',
                            'custom-input-full-text': 'background-color: ' + scope.options.backgroundColor + ';'
                        }

                    }

                    if (scope.item.frontOptions) {

                        /*if (scope.item.frontOptions.recalculated === 'input' || scope.item.frontOptions.autocalculated) {
                            scope.ciEventObj.event = {key: 'set_style_preset1'};

                        } else if (scope.item.frontOptions.recalculated === 'linked_inputs') {
                            scope.ciEventObj.event = {key: 'set_style_preset2'};

                        }*/
                        if (scope.item.frontOptions.recalculated || scope.item.frontOptions.autocalculated) {
                            scope.ciEventObj.event = {key: 'set_style_preset1'};
                        }

                    }

                }

                var initListeners = function () {
                    scope.evEditorEventService.addEventListener(evEditorEvents.MARK_FIELDS_WITH_ERRORS, function () {
                        scope.ciEventObj.event = {key: 'mark_not_valid_fields'};
                    });

                    scope.evEditorEventService.addEventListener(evEditorEvents.FIELDS_RECALCULATED, function () {

                        if (scope.item && scope.item.frontOptions &&
                            (scope.entity[scope.fieldKey] || scope.entity[scope.fieldKey] === 0)) {

                            setItemSpecificSettings();

                            /*if (scope.item.frontOptions.recalculated === 'input') {
                                scope.ciEventObj.event = {key: 'set_style_preset1'};

                            } else if (scope.item.frontOptions.recalculated === 'linked_inputs') {
                                scope.ciEventObj.event = {key: 'set_style_preset2'};

                            }*/

                            if (scope.item.frontOptions.recalculated || scope.item.frontOptions.autocalculated) {
                                scope.ciEventObj.event = {key: 'set_style_preset1'};
                            }

                        }
                    });

                    scope.evEditorEventService.addEventListener(evEditorEvents.FIELD_CHANGED, function () {

                        var changedUserInputData;

                        if (scope.evEditorDataService) {
                            changedUserInputData = scope.evEditorDataService.getChangedUserInputData();
                        }

                        if (changedUserInputData && changedUserInputData.frontOptions &&
                            changedUserInputData.frontOptions.linked_inputs_names) {

                            if (changedUserInputData.frontOptions.linked_inputs_names.indexOf(scope.fieldKey) > -1) {
                                scope.ciEventObj.event = {key: 'set_style_preset2'};
                            }

                        }

                    });
                };
                /*scope.$watch('eventSignal', function () {
                    if (scope.eventSignal) {
                        scope.ciEventObj.event = scope.eventSignal;
                    }
                });*/

                scope.init = function () {
                    scope.fieldKey = scope.getModelKey();
                    //var fieldKey = scope.getModelKey();

                    scope.options = {};

                    if (scope.evEditorEventService) {
                        initListeners();
                    }

                    if (scope.fieldKey === 'tags') {

                        scope.options = {
                            entityType: scope.entityType
                        }

                    } else {
                        if (metaService.getEntitiesWithSimpleFields().indexOf(scope.entityType) !== -1) {
                            scope.options = {
                                entityType: scope.entityType,
                                key: scope.fieldKey
                            };
                        }
                    }

                    var tooltipsList = [];

                    if (scope.evEditorDataService) {
                        tooltipsList = scope.evEditorDataService.getTooltipsData();
                    }

                    for (var i = 0; i < tooltipsList.length; i++) {

                        if (tooltipsList[i].key === scope.fieldKey) {

                            scope.tooltipText = tooltipsList[i].text;
                            break;

                        }

                    }

                    if (scope.item) {
                        setItemSpecificSettings();
                    }

                    if (scope.fieldType) {

                        if (scope.fieldType.value === 30) {

                            if (scope.entity) {

                                scope.classifierId = scope.entity[scope.fieldKey];

                                scope.findNodeItem().then(function () {
                                    scope.$apply();
                                })
                            }

                        }

                    }

                    checkForNotNull();

                    /*if (scope.fieldType && scope.fieldType.value === 20) {

                        scope.numericInputValue.numberVal = null;
                        setTimeout(function () {
                            numberInputContainerElem = elem[0].querySelector('.bfNumberInputContainer');
                            numberInputElem = elem[0].querySelector('.bfNumberInput');
                        }, 500);

                        if (scope.entity[scope.fieldKey] || scope.entity[scope.fieldKey] === 0) {

                            var itemNumberValue = JSON.parse(JSON.stringify(scope.entity[scope.fieldKey]));
                            scope.numericInputValue.numberVal = formatNumber(itemNumberValue);

                        }

                    }*/

                };

                scope.itemChange = function() {
                    if (scope.entityChange) {
                        scope.entityChange({fieldKey: scope.fieldKey});
                    }
                };

                scope.inputBlur = function () {
                    if (scope.onFieldBlur) {
                        scope.onFieldBlur();
                    }
                };

                scope.onDateChange = function () {

                    if (scope.entity[scope.fieldKey] === "") {
                        scope.entity[scope.fieldKey] = null;
                    }

                    scope.itemChange();

                };

                scope.init()

            }
        }
    }

}());