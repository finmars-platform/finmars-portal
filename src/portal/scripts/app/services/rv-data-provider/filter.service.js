(function () {

    var checkForEmptyRegularFilter = function (regularFilter, filterType) {
        // Need null's checks for filters of data type number
        if (filterType === 'from_to') {
            // console.log('filter checkForEmpty', regularFilter);
            if (regularFilter.min_value !== undefined &&
                regularFilter.max_value !== undefined &&
                regularFilter.min_value !== null &&
                regularFilter.max_value !== null) {
                return true;
            }

        } else if (Array.isArray(regularFilter)) {

            if (regularFilter && regularFilter.length > 0 && regularFilter[0] !== null) {
                return true;
            }

        }

        return false;

    };

    var filterTableRows = function (items, regularFilters, filterType, valueType) {
        // console.log("filter filter.service filterByDate", items, regularFilters, filterType, valueType);
        var match;

        return items.filter(function (item, tableRowIndex) {

            match = true;

            Object.keys(regularFilters).forEach(function (key) {

                if (key !== 'ordering') {
                    // console.log("filter data key", key, item);
                    if (checkForEmptyRegularFilter(regularFilters[key], filterType)) {

                        if (item.hasOwnProperty(key) && item[key]) {

                            // console.log("filter data type", item[key], typeof item[key] + '\n' + regularFilters[key], typeof regularFilters[key]);

                            var valueFromTable = JSON.parse(JSON.stringify(item[key]));
                            var filterArgument = JSON.parse(JSON.stringify(regularFilters[key]));

                            if (valueType === 10) {

                                if (filterType !== 'multiselector') {
                                    valueFromTable = valueFromTable.toLowerCase();
                                    filterArgument = filterArgument[0].toLowerCase();
                                }

                            }

                            if (valueType === 20) {

                                if (filterType !== 'from_to') {
                                    filterArgument = filterArgument[0];
                                }

                                // Compare position number of item with maximum allowed
                                if (filterType === 'top_n') {
                                    valueFromTable = tableRowIndex;
                                }

                                if (filterType === 'bottom_n') {
                                    valueFromTable = tableRowIndex;
                                    filterArgument = items.length - 1 - filterArgument // calculate how much items from beginning should be skipped
                                }
                                // < Compare position number of item with maximum allowed >

                            }

                            if (valueType === 40) {

                                switch (filterType) {
                                    case 'equal':
                                    case 'not_equal':
                                        valueFromTable = new Date(valueFromTable).toDateString();
                                        filterArgument = new Date(filterArgument[0]).toDateString();
                                        break;
                                    case 'from_to':
                                        valueFromTable = new Date(item[key]);
                                        filterArgument.min_value = new Date(filterArgument.min_value);
                                        filterArgument.max_value = new Date(filterArgument.max_value);
                                        break;
                                    case 'date_tree':
                                        valueFromTable = new Date(item[key]);
                                        // filterArgument is array of string
                                        break;
                                    default:
                                        valueFromTable = new Date(item[key]);
                                        filterArgument = new Date(filterArgument[0]);
                                        break;
                                }

                            }

                            match = filterValueFromTable(valueFromTable, filterArgument, filterType);

                        } else {
                            match = false;
                        }

                    } else {
                        // console.log("filter wrong regularFilter !!!!!");
                    }
                }

            });
            // console.log("filter filter.service match", match);
            return match;

        });

    };

    var filterValueFromTable = function (valueToFilter, filterBy, operationType) {
        // console.log("filter filterValueFromTable", valueToFilter, filterBy);
        switch (operationType) {

            case 'contain':
                if (valueToFilter.indexOf(filterBy) !== -1) {
                    return true;
                }
                break;

            case 'does_not_contain':
                if (valueToFilter.indexOf(filterBy) === -1) {
                    return true;
                }
                break;

            case 'equal':
            case 'selector':

                if (valueToFilter === filterBy) {
                    return true;
                }
                break;

            case 'not_equal':
                if (valueToFilter !== filterBy) {
                    return true;
                }
                break;

            case 'greater':
                if (valueToFilter > filterBy) {
                    return true;
                }
                break;

            case 'greater_equal':
                if (valueToFilter >= filterBy) {
                    return true;
                }
                break;

            case 'less':
                if (valueToFilter < filterBy) {
                    return true;
                }
                break;

            case 'less_equal':
                if (valueToFilter <= filterBy) {
                    return true;
                }
                break;

            case 'top_n':
                if (valueToFilter < filterBy) {
                    return true;
                }
                break;

            case 'bottom_n':
                if (valueToFilter > filterBy) {
                    return true;
                }
                break;

            case 'from_to':
                var minValue = filterBy.min_value;
                var maxValue = filterBy.max_value;
                // console.log("filter from_to values", minValue, maxValue);
                if (valueToFilter >= minValue && valueToFilter <= maxValue) {
                    return true;
                }
                break;

            case 'multiselector':
                // console.log("filter date multiselector data", filterBy, valueToFilter);
                if (filterBy.indexOf(valueToFilter) !== -1) {
                    return true;
                }
                break;

            case 'date_tree':

                var i;
                for (i = 0; i < filterBy.length; i++) {
                    // console.log("filter date tree item", filterBy[i], new Date(filterBy[i]).toDateString());
                    if (valueToFilter.toDateString() === new Date(filterBy[i]).toDateString()) {
                        return true;
                    }

                }
                break;

        }

        return false;

    };

    var filterByRegularFilters = function (items, regularFilters) {

        console.log('regularFilters', regularFilters);

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

    var getFilterMatch = function (item, key, value) {

        var item_value = item[key];
        var match = true;

        if (item_value === null || item_value === undefined) {

            if (value !== '-') {
                match = false;
            }

        } else {

            if (item_value.toString().toLowerCase() !== value.toLowerCase()) {
                match = false
            }

        }

        // console.log('match', match);

        return match

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

                    key = options.groups_types[i].key;

                    value = options.groups_values[i];

                    match = getFilterMatch(item, key, value);

                    if (match === false) {
                        break;
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

            if (['groups_order', 'groups_types', 'groups_values', 'page', 'page_size', 'filter_type', 'value_type'].indexOf(key) === -1) {

                result[key] = options[key];

            }

        });

        return result;

    };

    module.exports = {
        filterTableRows: filterTableRows,
        filterByRegularFilters: filterByRegularFilters,
        filterByGroupsFilters: filterByGroupsFilters,
        getRegularFilters: getRegularFilters
    }

}());