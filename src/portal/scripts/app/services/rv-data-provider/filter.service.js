(function () {

    var filterByRegularFilters = function (items, regularFilters) {

        // console.log('filterItems.regularFilters', regularFilters);

        var match;

        return items.filter(function (item) {

            match = true;

            Object.keys(regularFilters).forEach(function (key) {

                if (item.hasOwnProperty(key)) {

                    if (key !== 'ordering' && item[key].toString().indexOf(regularFilters[key]) === -1) {
                        match = false;
                    }

                } else {
                    match = false;
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

        console.log('getFilterMatchInAttributes', item);

        var match = false;

        if (item.hasOwnProperty(groupType.entity + '_object')) {

            console.log('item', item.instrument_object.user_code);
            console.log('key', key);
            console.log('value', value);

            for (var i = 0; i < item[groupType.entity + '_object'].attributes.length; i = i + 1) {

                var attr = item[groupType.entity + '_object'].attributes[i];

                if (attr.attribute_type === key) {

                    console.log('attr', attr);

                    var attrValue = getAttributeValue(attr, groupType);

                    console.log('attrValue', attrValue);
                    console.log('value', value);

                    if (attrValue == null) {

                        if (value === '-') {
                            match = true;
                        }

                    } else {

                        if (attrValue === value) {
                            match = true;
                        }

                    }

                    break;

                }

            }

        } else {

            if (value === '-') {
                match = true;
            }
        }

        console.log('match', match);

        return match;

    };

    var filterByGroupsFilters = function (items, options, groupTypes) {

        var i;

        if (groupTypes.length && options.groups_values.length) {

            var match;

            var key;
            var value;

            items = items.filter(function (item) {

                match = true;

                for (i = 0; i < options.groups_values.length; i = i + 1) {

                    key = options.groups_types[i];
                    value = options.groups_values[i];

                    // TODO Integer Group Types are for Attribute Types
                    if (typeof key === 'number') {

                        var groupType = groupTypes[i];

                        match = getFilterMatchInAttributes(item, groupType, key, value);

                    } else {


                        if (value === '-') {

                            if (item[key] !== null && item[key] !== undefined && item[key] !== '-') {
                                match = false;
                            }

                        } else {

                            if (!item.hasOwnProperty(key)) {
                                match = false;
                            } else {

                                if (item[key] === null || item[key] === undefined) {
                                    match = false

                                } else {

                                    if (item[key].toString().indexOf(value) === -1) {
                                        match = false
                                    }

                                }

                            }

                        }

                    }

                }

                return match

            });

        }

        return items;

    };

    var getRegularFilters = function (options) {

        var result = {};

        Object.keys(options).filter(function (key) {

            if (['groups_order', 'groups_types', 'groups_values', 'page'].indexOf(key) === -1) {

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