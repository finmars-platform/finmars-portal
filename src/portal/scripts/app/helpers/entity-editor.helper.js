(function () {

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
            value_string: null
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

    var checkForNotNullRestriction = function (item, entityAttrs, attrs) {

        var i, e, b, a;
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

            for (a = 0; a < attrs.length; a = a + 1) {
                if (keys[i] === attrs[a].name) {
                    if (attrs[a].options && attrs[a].options.notNull === true) {
                        if (item[keys[i]] === '' || item[keys[i]] == null || item[keys[i]] === undefined) {
                            isValid = false;
                        }
                    }
                }
            }
        }

        return isValid
    };

    var checkForNegNumsRestriction = function (item, entityAttrs, userInputs, layoutAttrs) {

        var fieldsWithNegVal = [];

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

        }

        return fieldsWithNegVal;
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

        generateAttributesFromLayoutFields: generateAttributesFromLayoutFields,
        fixCustomTabs: fixCustomTabs
    }

}());