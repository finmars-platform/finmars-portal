(function () {

    var metaService = require('../services/metaService');
    var evHelperService = require('../services/entityViewerHelperService');

    'use strict';

    var removeNullFields = function (item) {

        var i;
        var keys = Object.keys(item);
        var result = {};

        for (i = 0; i < keys.length; i = i + 1) {
            if (item[keys[i]] && item[keys[i]].length) {
                result[keys[i]] = item[keys[i]];
            } else {
                if (item[keys[i]] != null && !isNaN(item[keys[i]])) {
                    result[keys[i]] = item[keys[i]];
                }
            }
        }

        return result;

    };

    var clearUnusedAttributeValues = function (attributes) {
        var i;
        for (i = 0; i < attributes.length; i = i + 1) {
            if (attributes[i].classifier == null) {
                delete attributes[i].classifier;
            }
            if (attributes[i].value_date == null) {
                delete attributes[i].value_date;
            }
            if (attributes[i].value_float == null) {
                delete attributes[i].value_float;
            }
            if (attributes[i].value_string == null) {
                delete attributes[i].value_string;
            }
        }

        return attributes

    };

    var checkEntityAttrTypes = function (entity, entityAttrs) {
        var i;
        for (i = 0; i < entityAttrs.length; i = i + 1) {

            if (entityAttrs[i]['value_type'] === 40) {
                entity[entityAttrs[i].key] = moment(new Date(entity[entityAttrs[i].key])).format('YYYY-MM-DD');
            }

            if (entityAttrs[i]['value_type'] === 20 || entityAttrs[i]['value_type'] === 'float') {

                var withoutSpaces = (entity[entityAttrs[i].key] + '').replace(' ', '');
                var res;
                if (withoutSpaces.indexOf(',') !== -1) {
                    res = withoutSpaces.replace(',', '.');
                } else {
                    res = withoutSpaces;
                }
                entity[entityAttrs[i].key] = parseFloat(res);

            }
        }

        entity.attributes.forEach(function (item) {
            if (item['value_date'] !== null) {
                item['value_date'] = moment(new Date(item['value_date'])).format('YYYY-MM-DD');
            }
        });

        return entity;
    };

    var appendAttribute = function (attr, value) {
        var attribute = {
            attribute_name: attr.name,
            attribute_type: attr.id,
            classifier: null,
            value_date: null,
            value_float: null,
            value_string: null,
            attribute_type_object: attr
        };

        if (attr['value_type'] === 10) {
            attribute['value_string'] = value;
        }

        if (attr['value_type'] === 20) {
            attribute['value_float'] = value;
        }

        if (attr['value_type'] === 30) {
            attribute['classifier'] = value;
        }
        if (attr['value_type'] === 40) {
            attribute['value_date'] = value;
        }

        return attribute;
    };

    var updateValue = function (entityAttr, attr, value) {

        if (attr['value_type'] === 10) {
            entityAttr['value_string'] = value;
        }

        if (attr['value_type'] === 20) {
            entityAttr['value_float'] = value;
        }

        if (attr['value_type'] === 30) {
            entityAttr['classifier'] = value;
        }

        if (attr['value_type'] === 40) {
            entityAttr['value_date'] = value;
        }

        return entityAttr;
    };

    var getLocationOfAttribute = function (attrKey, tabs, fixedFieldsAttrs, entityType) {

        if (fixedFieldsAttrs.length &&
            attrKey &&
            fixedFieldsAttrs.indexOf(attrKey) > -1) {

            return 'Top of dialog window.';

        } else {

            if (entityType === 'instrument' &&
                attrKey === 'maturity_date') { // special case

                return 'tab: EVENTS';

            } else {

                var i, a;
                for (i = 0; i < tabs.length; i++) {

                    var tab = tabs[i];

                    for (a = 0; a < tab.layout.fields.length; a++) {

                        var socket = tab.layout.fields[a];

                        if (socket.type === 'field') {

                            if (socket.attribute.hasOwnProperty('key')) {

                                if (socket.attribute.key === attrKey) {
                                    return 'tab: ' + tab.name.toUpperCase();
                                }

                            } else if (socket.attribute.hasOwnProperty('user_code')) {

                                if (socket.attribute.user_code === attrKey) {
                                    return 'tab: ' + tab.name.toUpperCase();
                                }

                            }

                        }

                    }

                }

            }

        }

        return null;

    };

    /*var checkForNotNullRestriction = function (key, value, entityAttrs, attrsTypes) {

        var fieldAttr = null;
        /!*var i, e, b, a;
        var keys = Object.keys(item);
        var isValid = true;

        for (i = 0; i < keys.length; i = i + 1) {

            for (e = 0; e < entityAttrs.length; e = e + 1) {
                if (keys[i] === entityAttrs[e].key) {
                    if (entityAttrs[e].options && entityAttrs[e].options.notNull === true) {
                        if (item[keys[i]] === '' || item[keys[i]] == null || item[keys[i]] === undefined) {
                            isValid = false;
                        }
                    }
                }
            }

            for (a = 0; a < attrsTypes.length; a = a + 1) {
                if (keys[i] === attrsTypes[a].name) {
                    if (attrsTypes[a].options && attrsTypes[a].options.notNull === true) {
                        if (item[keys[i]] === '' || item[keys[i]] == null || item[keys[i]] === undefined) {
                            isValid = false;
                        }
                    }
                }
            }
        }*!/

        var a, e;

        for (e = 0; e < entityAttrs.length; e = e + 1) {
            if (key === entityAttrs[e].key) {
                fieldAttr = entityAttrs[e];
                /!*if (entityAttrs[e].options && entityAttrs[e].options.notNull === true) {
                    if (value !== 0 && !value) {

                        return {
                            fieldName: entityAttrs[e].options.fieldName || entityAttrs[e].verbose_name || entityAttrs[e].name,
                            message: 'Field should not be empty'
                        }

                    }
                }*!/
            }
        }

        if (!fieldAttr) {
            for (a = 0; a < attrsTypes.length; a = a + 1) {
                if (key === attrsTypes[a].user_code || key === attrsTypes[a].key) {
                    fieldAttr = attrsTypes[a];
                    /!*if (attrsTypes[a].options && attrsTypes[a].options.notNull === true) {
                        if (value !== 0 && !value) {

                            return {
                                fieldName: attrsTypes[a].options.fieldName || attrsTypes[a].verbose_name || attrsTypes[a].name,
                                message: 'Field should not be empty'
                            }

                        }
                    }*!/
                }
            }
        }

        if (fieldAttr) {

            if (fieldAttr.options && fieldAttr.options.notNull === true) {

                if (value !== 0 && !value) {

                    return {
                        fieldName: fieldAttr.options.fieldName || fieldAttr.verbose_name || fieldAttr.name,
                        message: 'Field should not be empty'
                    }

                }

            }

        }

        return false;

    };*/

    var checkForNotNullRestriction = function (key, value, attrData, tabs, fixedFieldsAttrs, entityType, errorsList) {

        if (attrData.options && attrData.options.notNull === true) {

            if (value !== 0 && !value) {

                errorsList.push({
                    location: getLocationOfAttribute(key, tabs, fixedFieldsAttrs, entityType),
                    fieldName: attrData.options.fieldName || attrData.verbose_name || attrData.name,
                    message: 'Field should not be empty.'
                })

            }

        }

        //return false;

    };

    var validateDateField = function (value, fieldAttr) {

        if (!value) {

            value = null;

        } else if (!moment(value, 'YYYY-MM-DD', true).isValid()) {

            var errorObj = {
                fieldName: fieldAttr.verbose_name || fieldAttr.name,
                message: 'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.'
            };

            if (fieldAttr.options && fieldAttr.options.fieldName) {
                return {
                    fieldName: fieldAttr.options.fieldName || fieldAttr.verbose_name || fieldAttr.name,
                    message: 'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.'
                }
            }

            return errorObj;

        }

    };

    /*var checkForNegNumsRestriction = function (key, value, entityAttrs, attrsTypes, userInputs, layoutAttrs) {

        /!*var fieldsWithNegVal = [];

        var i, e, a, b;
        var keys = Object.keys(item);
        for (i = 0; i < keys.length; i = i + 1) {
            var attrWithNegVal = null;
            var foundAttr = false;

            for (e = 0; e < entityAttrs.length; e = e + 1) {
                if (keys[i] === entityAttrs[e].key) {
                    if (entityAttrs[e].options && entityAttrs[e].options.onlyPositive === true) {
                        if (item[keys[i]] == null || item[keys[i]] === undefined) {
                            attrWithNegVal = entityAttrs[e];
                            foundAttr = true;
                            break;
                        }
                    }
                }
            }

            if (!foundAttr) {
                for (a = 0; a < userInputs.length; a = a + 1) {
                    if (keys[i] === userInputs[a].name) {
                        if (userInputs[a].options && userInputs[a].options.onlyPositive === true) {
                            if (item[keys[i]] == null || item[keys[i]] === undefined) {
                                attrWithNegVal = userInputs[a];
                                foundAttr = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!foundAttr) {
                for (b = 0; b < layoutAttrs.length; b = b + 1) {
                    if (keys[i] === layoutAttrs[b].name) {
                        if (layoutAttrs[b].options && layoutAttrs[b].options.onlyPositive === true) {
                            if (item[keys[i]] == null || item[keys[i]] === undefined) {
                                attrWithNegVal = layoutAttrs[b];
                                break;
                            }
                        }
                    }
                }
            }

            if (attrWithNegVal) {
                if (attrWithNegVal.options && attrWithNegVal.options.fieldName) {
                    fieldsWithNegVal.push(attrWithNegVal.options.fieldName);
                } else if (attrWithNegVal.hasOwnProperty('verbose_name')) {
                    fieldsWithNegVal.push(attrWithNegVal.verbose_name);
                } else {
                    fieldsWithNegVal.push(attrWithNegVal.name);
                }
            }

        }*!/
        var i, a;

        for (i = 0; i < entityAttrs.length; i++) {
            if (key === entityAttrs[i].key) {
                if (entityAttrs[i].options && entityAttrs[i].options.onlyPositive === true) {
                    if (value === null || value === undefined) {

                        return {
                            fieldName: entityAttrs[i].options.fieldName || entityAttrs[i].verbose_name || entityAttrs[i].name,
                            message: 'Field should have positive number'
                        }

                    }
                }
            }
        }

        for (a = 0; a < userInputs.length; a = a + 1) {
            if (key === userInputs[a].name) {
                if (userInputs[a].options && userInputs[a].options.onlyPositive === true) {
                    if (value === null || value === undefined) {

                        return {
                            fieldName: userInputs[a].options.fieldName || userInputs[a].verbose_name || userInputs[a].name,
                            message: 'Field should have positive number'
                        }

                    }
                }
            }
        }

        /!*for (b = 0; b < layoutAttrs.length; b = b + 1) {
            if (key === layoutAttrs[b].name) {
                if (layoutAttrs[b].options && layoutAttrs[b].options.onlyPositive === true) {
                    if (value === null || value === undefined) {

                        return {
                            fieldName: layoutAttrs[b].options.fieldName || layoutAttrs[b].verbose_name || layoutAttrs[b].name,
                            message: 'Field should have positive number'
                        }

                    }
                }
            }
        }*!/

        return false;
    };*/

    var checkForNegNumsRestriction = function (key, value, attrData, tabs, fixedFieldsAttrs, entityType, errorsList) {

        if (attrData.options && attrData.options.onlyPositive === true) {
            if (value === null || value === undefined) {

                errorsList.push({
                    location: getLocationOfAttribute(key, tabs, fixedFieldsAttrs, entityType),
                    fieldName: attrData.options.fieldName || attrData.verbose_name || attrData.name,
                    message: 'Field should have positive number'
                })

            }
        }
        //return false;
    };

    var validateRequiredEntityFields = function (key, value, requiredAttrs, entityAttrs) {

        for (var i = 0; i < entityAttrs.length; i++) {

            if (key === entityAttrs[i].key) {

                var errorObj = null;

                if (!value && value !== 0) {

                    errorObj = {
                        message: 'Field should not be empty'
                    };

                } else if (entityAttrs[i].value_type === 40) {

                    if (!moment(value, 'YYYY-MM-DD', true).isValid()) {

                        errorObj = {
                            message: 'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.'
                        };

                    }

                }

                if (errorObj) {

                    if (entityAttrs[i].options && entityAttrs[i].options.fieldName) {

                        errorObj.fieldName = entityAttrs[i].options.fieldName;

                    } else if (entityAttrs[i].verbose_name) {
                        errorObj.fieldName = entityAttrs[i].verbose_name;
                    } else {
                        errorObj.fieldName = entityAttrs[i].name;
                    }

                    return errorObj;

                }

            }

        }

        return false;

    };

    var validateEvField = function (key, fieldValue, attr, tabs, fixedFieldsAttrs, entityType, errorsList) {

        if ((attr.attribute_type_object && attr.attribute_type_object.value_type === 40) ||
            attr.value_type === 40) {

            var dateFieldError = validateDateField(fieldValue, attr);
            if (dateFieldError) {
                dateFieldError.location = getLocationOfAttribute(key, tabs, fixedFieldsAttrs, entityType);
                errorsList.push(dateFieldError);
            }

        } else {

            checkForNotNullRestriction(key, fieldValue, attr, tabs, fixedFieldsAttrs, entityType, errorsList);
            checkForNegNumsRestriction(key, fieldValue, attr, tabs, fixedFieldsAttrs, entityType, errorsList);

        }

    };

    var validateEntityFields = function (item, entityType, tabs, fixedFieldsAttrs, entityAttrs, attrsTypes) {

        var dynamicAttrs = item.attributes;
        var requiredAttrs = metaService.getRequiredEntityAttrs(entityType);
        var errors = [];

        entityAttrs.forEach(function (entityAttr) {

            var key = entityAttr.key;
            var fieldValue = item[key];

            if (requiredAttrs.indexOf(key) > -1) {

                var reqFieldError = validateRequiredEntityFields(key, fieldValue, requiredAttrs, entityAttrs);

                if (reqFieldError) {

                    reqFieldError.location = getLocationOfAttribute(key, tabs, fixedFieldsAttrs, entityType);
                    errors.push(reqFieldError);

                }

            } else {

                validateEvField(key, fieldValue, entityAttr, tabs, fixedFieldsAttrs, entityType, errors);

            }

        });

        if (dynamicAttrs && dynamicAttrs.length) {

            dynamicAttrs.forEach(function (dAttrData) {

                var key = dAttrData.attribute_type_object.user_code;
                var fieldValue = evHelperService.getDynamicAttrValue(dAttrData);
                var attrType;

                for (var i = 0; i < attrsTypes.length; i++) {

                    if (attrsTypes[i].user_code === key) {
                        attrType = attrsTypes[i];
                    }

                }

                if (attrType) {
                    validateEvField(key, fieldValue, attrType, tabs, fixedFieldsAttrs, entityType, errors);
                }

            });

        }

        return errors;

    };

    var validateComplexTransactionUserInput = function (userInput, fieldValue, transactionsTypeActions, tabs, errorsList) {

        validateEvField(userInput.name, fieldValue, userInput, tabs, [], 'complex-transaction', errorsList);

        if (!userInput.options || !userInput.options.notNull) { // fields of user inputs that are used inside of actions should be filled

            var i, a;
            for (i = 0; i < transactionsTypeActions.length; i++) {

                var action = transactionsTypeActions[i];
                var actionKeys = Object.keys(action);

                for (a = 0; a < actionKeys.length; a++) {

                    var aKey = actionKeys[a];

                    if (action[aKey] && typeof action[aKey] === 'object') {

                        var actionItem = action[aKey];
                        var actionItemKeys = Object.keys(actionItem);

                        actionItemKeys.forEach(function (aItemKey) {

                            if (aItemKey.indexOf('_object') < 0 &&
                                aItemKey.indexOf('_input') < 0 &&
                                aItemKey.indexOf('_phantom') && aItemKey !== 'action_notes') {

                                if ((aItemKey === 'notes' || !actionItem.hasOwnProperty(aItemKey + '_input')) &&
                                    actionItem[aItemKey] && typeof actionItem[aItemKey] === 'string') {

                                    var middleOfExpr = '[^A-Za-z_.]' + userInput.name + '(?![A-Za-z1-9_])';
                                    var beginningOfExpr = '^' + userInput.name + '(?![A-Za-z1-9_])';

                                    var inputRegExpObj = new RegExp(beginningOfExpr + '|' + middleOfExpr, 'g');

                                    if (actionItem[aItemKey].match(inputRegExpObj)) {

                                        if ((typeof fieldValue === 'number' && isNaN(fieldValue)) || fieldValue === undefined || fieldValue === null || fieldValue === '') {

                                            console.log('fieldValue', fieldValue);

                                            var errorObj = {
                                                location: getLocationOfAttribute(userInput.name, tabs, []),
                                                fieldName: userInput.verbose_name || userInput.name,
                                                message: 'Field should not be empty.'
                                            };

                                            if (userInput.options && userInput.options.fieldName) {
                                                errorObj.fieldName = userInput.options.fieldName;
                                            }

                                            errorsList.push(errorObj);

                                        }

                                    }

                                }

                            }

                        });

                    }

                }

            }

        }


    };

    var validateComplexTransactionFields = function (item, transactionsTypeActions, tabs, entityAttrs, attrsTypes, userInputs) {

        var errors = validateEntityFields(item, 'complex-transaction', tabs, [], entityAttrs, attrsTypes);

        console.log('validateComplexTransactionFields.errors', errors);

        if (userInputs && userInputs.length) {

            userInputs.forEach(function (uInput) {

                var iName = uInput.name;
                var fieldValue = item[iName];

                validateComplexTransactionUserInput(uInput, fieldValue, transactionsTypeActions, tabs, errors);

            });

        }

        return errors;
    };

    var createFieldsTree = function (tabs) {

        var tabsCopy = JSON.parse(JSON.stringify(tabs));

        var fieldsTree = {};

        tabsCopy.forEach(function (tab) {

            fieldsTree[tab.tabOrder] = {};
            var f;
            for (f = 0; f < tab.layout.fields.length; f++) {

                var treeTab = fieldsTree[tab.tabOrder];

                var field = tab.layout.fields[f];
                var fRow = field.row;
                var fCol = field.column;

                if (!treeTab[fRow]) {
                    treeTab[fRow] = {};
                }

                treeTab[fRow][fCol] = field;

            }

        });

        return fieldsTree;
    };

    var createFixedAreaFieldsTree = function (fixedAreaFields) {

        var fixedAreaFieldsCopy = JSON.parse(JSON.stringify(fixedAreaFields));
        var fixedAreaFieldsTree = {};

        var i;
        for (i = 0; i < fixedAreaFieldsCopy.length; i++) {

            var field = fixedAreaFields.fields[i];
            var fRow = field.row;
            var fCol = field.column;

            if (!fixedAreaFieldsTree[fRow]) {
                fixedAreaFieldsTree[fRow] = {};
            }

            fixedAreaFieldsTree[fRow][fCol] = field;

        }

        return fixedAreaFieldsTree;

    };


    var getMatchForLayoutFields = function (tab, tabIndex, attributes, tabResult, fieldsToEmptyList, forComplexTransaction) {

        var i, l, e, u;

        tab.layout.fields.forEach(function (field, fieldIndex) {

            var fieldResult = {};

            var dynamicAttrs = attributes.dynamicAttrs;
            var entityAttrs = attributes.entityAttrs;
            var layoutAttrs = attributes.layoutAttrs;

            if (field && field.type === 'field') {

                var attrFound = false;

                if (field.attribute_class === 'attr') {

                    for (i = 0; i < dynamicAttrs.length; i = i + 1) {

                        if (field.key) {

                            if (field.key === dynamicAttrs[i].user_code) {

                                dynamicAttrs[i].options = field.options;
                                //fieldResult = dynamicAttrs[i];
                                tabResult[field.row][field.column] = dynamicAttrs[i];
                                attrFound = true;
                                break;

                            }

                        } else {

                            if (field.attribute.user_code) {

                                if (field.attribute.user_code === dynamicAttrs[i].user_code) {

                                    dynamicAttrs[i].options = field.options;
                                    fieldResult = dynamicAttrs[i];
                                    attrFound = true;
                                    break;

                                }

                            }

                        }

                    }

                    if (!attrFound) {
                        var fieldPath = {
                            tabIndex: tabIndex,
                            fieldIndex: fieldIndex
                        };

                        fieldsToEmptyList.push(fieldPath);
                    }

                } else {

                    for (e = 0; e < entityAttrs.length; e = e + 1) {
                        if (field.name === entityAttrs[e].name) {
                            entityAttrs[e].options = field.options;
                            fieldResult = entityAttrs[e];

                            attrFound = true;
                            break;
                        }
                    }

                    if (!attrFound) {
                        for (l = 0; l < layoutAttrs.length; l = l + 1) {
                            if (field.name === layoutAttrs[l].name) {
                                layoutAttrs[l].options = field.options;
                                fieldResult = layoutAttrs[l];

                                attrFound = true;
                                break;
                            }
                        }
                    }

                }

                if (field.backgroundColor) {
                    fieldResult.backgroundColor = field.backgroundColor;
                }

                if (forComplexTransaction) {

                    var userInputs = attributes.userInputs;

                    if (field.attribute_class === 'userInput') {

                        for (u = 0; u < userInputs.length; u = u + 1) {
                            //console.log('userInputs[u]', userInputs[u]);
                            if (field.name === userInputs[u].name) {
                                userInputs[u].options = field.options;
                                // return userInputs[u];
                                fieldResult = userInputs[u];

                                attrFound = true;
                                break;
                            }
                        }

                        if (!attrFound) {
                            var fieldPath = {
                                tabIndex: tabIndex,
                                fieldIndex: fieldIndex
                            };

                            fieldsToEmptyList.push(fieldPath);
                        }

                    }

                    fieldResult.editable = field.editable;

                }

            }

            //tabResult.push(fieldResult);
            tabResult[field.row][field.column] = fieldResult;

        });

    };

    var removeFieldsWithoutMatchingAttrs = function (tabs, fieldsToEmptyList, dataConstructorLayout) {

        fieldsToEmptyList.forEach(function (fieldPath) {

            if (fieldPath.tabIndex === 'fixedArea') {
                var dcLayoutFields = tabs.layout.fields;
                var layoutFieldsToSave = dataConstructorLayout.data.fixedArea.layout.fields;

            } else {
                var dcLayoutFields = tabs[fieldPath.tabIndex].layout.fields;

                if (Array.isArray(dataConstructorLayout.data)) { // for old layouts
                    var layoutFieldsToSave = dataConstructorLayout.data[fieldPath.tabIndex].layout.fields;
                } else {
                    var layoutFieldsToSave = dataConstructorLayout.data.tabs[fieldPath.tabIndex].layout.fields;
                }
            }

            var fieldToEmptyColumn = dcLayoutFields[fieldPath.fieldIndex].column;
            var fieldToEmptyRow = dcLayoutFields[fieldPath.fieldIndex].row;

            dcLayoutFields[fieldPath.fieldIndex] = { // removing from view
                colspan: 1,
                column: fieldToEmptyColumn,
                editMode: false,
                row: fieldToEmptyRow,
                type: 'empty'
            };

            layoutFieldsToSave[fieldPath.fieldIndex] = { // removing from layout copy for saving
                colspan: 1,
                column: fieldToEmptyColumn,
                editMode: false,
                row: fieldToEmptyRow,
                type: 'empty'
            };

        });

    };

    var generateAttributesFromLayoutFields = function (tabs, attributes, dataConstructorLayout, forComplexTransaction) {

        var result = {
            attributesLayout: {},
            dcLayoutHasBeenFixed: false
        };

        var fieldsToEmptyList = [];
        var tabResult;

        if (Array.isArray(tabs)) { // for tabs

            result.attributesLayout = createFieldsTree(tabs);

            tabs.forEach(function (tab, tabIndex) {

                tabResult = [];

                getMatchForLayoutFields(tab, tabIndex, attributes, result.attributesLayout[tab.tabOrder], fieldsToEmptyList, forComplexTransaction);

                //result.attributesLayout.push(tabResult);

            });

        } else { // for fixed area

            result.attributesLayout = createFixedAreaFieldsTree(tabs);

            getMatchForLayoutFields(tabs, 'fixedArea', fieldsToEmptyList, result.attributesLayout, attributes, forComplexTransaction);

        }

        if (fieldsToEmptyList.length) {
            removeFieldsWithoutMatchingAttrs(tabs, fieldsToEmptyList, dataConstructorLayout);
            result.dcLayoutHasBeenFixed = true;
        }

        return result;

    };

    var fixCustomTabs = function (tabs, dataConstructorLayout) {

        var dcLayoutHasBeenFixed = false;

        var fixTab = function (tab, numberOfRows, numberOfCols, viewFieldsList, fieldsListToSave) {

            var i, c;
            for (i = 1; i <= numberOfRows; i++) {
                var row = tab[i];

                for (c = 1; c <= numberOfCols; c++) {

                    if (!row[c]) {

                        var missingSocket = {
                            colspan: 1,
                            column: c,
                            editMode: false,
                            row: i,
                            type: 'empty'
                        };

                        viewFieldsList.push(missingSocket);
                        fieldsListToSave.push(missingSocket);
                        dcLayoutHasBeenFixed = true;

                    }

                }

            }
        };

        var tabsFieldsTree = createFieldsTree(tabs);

        if (Object.keys(tabsFieldsTree).length) {
            Object.keys(tabsFieldsTree).forEach(function (tabNumber, tabIndex) {

                var tab = tabsFieldsTree[tabIndex];
                var numberOfRows = tabs[tabIndex].layout.rows;
                var numberOfCols = tabs[tabIndex].layout.columns;

                var dataConstructorTabs = dataConstructorLayout.data;
                if (!Array.isArray(dataConstructorTabs)) {
                    dataConstructorTabs = dataConstructorLayout.data.tabs;
                }

                fixTab(tab, numberOfRows, numberOfCols, tabs[tabIndex].layout.fields, dataConstructorTabs[tabIndex].layout.fields);

            });
        }

        if (tabs.isActive) { // for fixed area
            var fixedAreaFieldsTree = createFixedAreaFieldsTree(tabs.layout.fields);

            if (Object.keys(fixedAreaFieldsTree).length) {
                var numberOfRows = tabs.layout.rows;
                var numberOfCols = tabs.layout.columns;

                fixTab(fixedAreaFieldsTree, numberOfRows, numberOfCols, tabs.layout.fields, dataConstructorLayout.layout.fields);
            }

        }

        return dcLayoutHasBeenFixed;

    };

    module.exports = {
        checkEntityAttrTypes: checkEntityAttrTypes,
        removeNullFields: removeNullFields,
        clearUnusedAttributeValues: clearUnusedAttributeValues,
        appendAttribute: appendAttribute,
        updateValue: updateValue,
        checkForNotNullRestriction: checkForNotNullRestriction,
        checkForNegNumsRestriction: checkForNegNumsRestriction,
        validateEntityFields: validateEntityFields,
        validateComplexTransactionFields: validateComplexTransactionFields,

        generateAttributesFromLayoutFields: generateAttributesFromLayoutFields,
        fixCustomTabs: fixCustomTabs
    }

}());