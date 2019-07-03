(function () {

    var checkForNulls = function (item) {

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
            //console.log('entityAttrs[i]', entityAttrs[i]);
            if (entityAttrs[i]['value_type'] === 40) {
                entity[entityAttrs[i].key] = moment(new Date(entity[entityAttrs[i].key])).format('YYYY-MM-DD');
            }
            if (entityAttrs[i]['value_type'] === 20 || entityAttrs[i]['value_type'] === 'float') {
                //console.log('entity[entityAttrs[i].key]', entity[entityAttrs[i].key]);
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
                            isValid = false
                        }
                    }
                }
            }

            for (a = 0; a < attrs.length; a = a + 1) {
                if (keys[i] === attrs[a].name) {
                    if (attrs[a].options && attrs[a].options.notNull === true) {
                        if (item[keys[i]] === '' || item[keys[i]] == null || item[keys[i]] === undefined) {
                            isValid = false
                        }
                    }
                }
            }
        }

        return isValid
    };

    module.exports = {
        checkEntityAttrTypes: checkEntityAttrTypes,
        checkForNulls: checkForNulls,
        clearUnusedAttributeValues: clearUnusedAttributeValues,
        appendAttribute: appendAttribute,
        updateValue: updateValue,
        checkForNotNullRestriction: checkForNotNullRestriction
    }

}());