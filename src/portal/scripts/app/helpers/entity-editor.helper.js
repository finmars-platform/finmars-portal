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

    module.exports = {
        checkEntityAttrTypes: checkEntityAttrTypes,
        removeNullFields: removeNullFields,
        clearUnusedAttributeValues: clearUnusedAttributeValues,
        appendAttribute: appendAttribute,
        updateValue: updateValue,
        checkForNotNullRestriction: checkForNotNullRestriction,
        checkForNegNumsRestriction: checkForNegNumsRestriction
    }

}());