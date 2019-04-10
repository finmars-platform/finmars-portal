(function () {

    var filterByRegularFilters = function (items, regularFilters) {

        var match;

        return items.filter(function (item) {

            match = true;

            Object.keys(regularFilters).forEach(function (key) {

                if (key !== 'ordering') {

                    if (item.hasOwnProperty(key) && item[key]) {

                        if (item[key].toString().indexOf(regularFilters[key]) === -1) {
                            match = false;
                        }

                    } else {
                        match = false;
                    }

                }

            });

            return match

        });

    };

    var getAttributeValue = function (attr, groupType) {

        if (groupType.value_type === 10) {

            return attr.value_string;

        }

        if (groupType.value_type === 20) {

            return attr.value_float;

        }

        if (groupType.value_type === 30) {

            if (attr.classifier_object) {
                return attr.classifier_object.name;
            } else {
                return null;
            }

        }

        if (groupType.value_type === 40) {

            return attr.value_date;

        }

    };

    var getFilterMatchInAttributes = function (item, groupType, key, value) {

        var match = false;

        if (item.hasOwnProperty(groupType.entity + '_object')) {

            var i;
            var attr;
            var value_exists = false;

            for (i = 0; i < item[groupType.entity + '_object'].attributes.length; i = i + 1) {

                attr = item[groupType.entity + '_object'].attributes[i];

                if (attr.attribute_type === key) {

                    var attrValue = getAttributeValue(attr, groupType);

                    if (attrValue) {
                        value_exists = true;
                    }

                    if (attrValue === value) {
                        match = true;
                        break;
                    }

                }

            }

            if (value === '-' && !value_exists) {
                match = true;
            }


        } else {

            if (value === '-') {
                match = true;
            }
        }

        return match;

    };

    var getFilterMatch = function (item, groupType, key, value) {

        var item_value = item[key];
        var match = true;

        // console.log("groupType.entity", groupType.entity);
        // console.log("getFilterMatch.item_value", item_value);

        if (value === '-') {

            if (item_value && item_value !== '-') {
                match = false;
            }

        } else {

            if (!item_value) {

                match = false;

            } else {

                if (item_value.toString().indexOf(value) === -1) {
                    match = false
                }

            }

        }

        return match

    };


    // DEPRECATED
    var getFilterMatchInField = function (item, groupType, key, value) {

        var item_value = null;
        var match = true;

        if (item[key + '_object']) {
            item_value = item[key + '_object'].user_code;
        }

        if (value === '-') {

            if (item_value !== null && item_value !== undefined && item_value !== '-') {
                match = false;
            }

        } else {

            if (item_value === null || item_value === undefined) {
                match = false

            }

            if (item_value && item_value.toString().indexOf(value) === -1) {
                match = false
            }

        }

        return match;

    };

    var filterByGroupsFilters = function (items, options, groupTypes) {

        var i;

        if (groupTypes.length && options.groups_values.length) {

            var match;

            var key;
            var value;
            var groupType;


            // console.log('filterByGroupsFilters.options', JSON.parse(JSON.stringify(options)));

            items = items.filter(function (item) {

                match = true;

                for (i = 0; i < options.groups_values.length; i = i + 1) {


                    if (options.groups_types[i].id) {
                        key = options.groups_types[i].id
                    } else {
                        key = options.groups_types[i].key;
                    }

                    value = options.groups_values[i];

                    groupType = groupTypes[i];

                    if (groupType.hasOwnProperty('id')) {

                        match = getFilterMatchInAttributes(item, groupType, key, value);

                    } else {

                        match = getFilterMatch(item, groupType, key, value);

                    }

                    if (match === false) {
                        break;
                    }

                }

                return match

            });

        }

        // console.log('filterByGroupsFilters.items', JSON.parse(JSON.stringify(items)));

        return items;

    };

    var getRegularFilters = function (options) {

        var result = {};

        Object.keys(options).filter(function (key) {

            if (['groups_order', 'groups_types', 'groups_values', 'page', 'page_size'].indexOf(key) === -1) {

                result[key] = options[key];

            }

        });

        return result;

    };

    module.exports = {
        filterByRegularFilters: filterByRegularFilters,
        filterByGroupsFilters: filterByGroupsFilters,
        getRegularFilters: getRegularFilters
    }

}());