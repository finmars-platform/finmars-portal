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

        var match = false;

        if (item.hasOwnProperty(groupType.entity + '_object')) {

            item[groupType.entity + '_object'].attributes.forEach(function (attr) {

                if (attr.attribute_type === key) {

                    var attrValue = getAttributeValue(attr, groupType);

                    if (attrValue === value) {
                        match = true;
                    }

                    if (value === '-') {
                        if (attrValue === null || attrValue === undefined || attrValue === '-') {
                            match = true;
                        }
                    }

                }

            })


        } else {

            if (value === '-') {
                match = true;
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

            // console.log('filterByGroupsFilters.options', JSON.parse(JSON.stringify(options)));

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

                        if (match === false) {
                            break;
                        }

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