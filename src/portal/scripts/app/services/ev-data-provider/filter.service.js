(function () {
    // method needed to prevent removal of all rows in case of using filter with empty value but active excludeEmptyCells
    var checkForEmptyRegularFilter = function (regularFilterValue, filterType) {
        // Need null's checks for filters of data type number

        if (filterType === 'from_to') {

            if ((regularFilterValue.min_value || regularFilterValue.min_value === 0) &&
                (regularFilterValue.max_value || regularFilterValue.max_value === 0)) {
                return true;
            }

        } else if (Array.isArray(regularFilterValue)) {

            if (regularFilterValue[0] || regularFilterValue[0] === 0) {
                return true;
            }

        }

        return false;

    };

    var filterTableRows = function (flatList, regularFilters, groupsList) {
        var match;

        return flatList.filter(function (flItem) {

            match = true;

            var rf;
            for (rf = 0; rf < regularFilters.length; rf++) {

                var item;

                var keyProperty = regularFilters[rf].key;
                var valueType = regularFilters[rf].value_type;
                var filterType = regularFilters[rf].filter_type;
                var excludeEmptyCells = regularFilters[rf].exclude_empty_cells;
                var filterValue = regularFilters[rf].value;

                if (keyProperty !== 'ordering') {

                    if (flItem.___type === 'group') {

                        var groupIndex = flItem.___level - 1;
                        var groupData = groupsList[groupIndex];
                        item = {};
                        item[groupData['key']] = flItem.___group_name;

                    } else if (flItem.___type === 'object') {

                        item = flItem;

                    } else {
                        match = true;
                        break;
                    };

                    if (item.hasOwnProperty(keyProperty) && item[keyProperty]) { // check if cell used to filter row is not empty

                        if (filterType === 'empty') { // prevent pass of cells with values
                            match = false;
                            break;
                        };

                        if (checkForEmptyRegularFilter(filterValue, filterType)) {

                            var valueFromTable = JSON.parse(JSON.stringify(item[keyProperty]));
                            var filterArgument = JSON.parse(JSON.stringify(filterValue));

                            if (valueType === 10 ||
                                valueType === 30 ||
                                valueType === 'field') {

                                if (filterType !== 'multiselector') {
                                    valueFromTable = valueFromTable.toLowerCase();
                                    filterArgument = filterArgument[0].toLowerCase();
                                }

                            };

                            if (valueType === 20) {

                                if (filterType !== 'from_to') {
                                    filterArgument = filterArgument[0];
                                }

                                // Compare position number of item with maximum allowed
                                /*if (filterType === 'top_n') {
                                    valueFromTable = tableRowIndex;
                                }

                                if (filterType === 'bottom_n') {
                                    valueFromTable = tableRowIndex;
                                    filterArgument = items.length - 1 - filterArgument // calculate how much items from beginning should be skipped
                                }*/
                                // < Compare position number of item with maximum allowed >

                            };

                            if (valueType === 40) {

                                switch (filterType) {
                                    case 'equal':
                                    case 'not_equal':
                                        valueFromTable = new Date(valueFromTable).toDateString();
                                        filterArgument = new Date(filterArgument[0]).toDateString();
                                        break;
                                    case 'from_to':
                                        valueFromTable = new Date(item[keyProperty]);
                                        filterArgument.min_value = new Date(filterArgument.min_value);
                                        filterArgument.max_value = new Date(filterArgument.max_value);
                                        break;
                                    case 'date_tree':
                                        valueFromTable = new Date(item[keyProperty]);
                                        // filterArgument is array of strings
                                        break;
                                    default:
                                        valueFromTable = new Date(item[keyProperty]);
                                        filterArgument = new Date(filterArgument[0]);
                                        break;
                                }

                            };

                            match = filterValueFromTable(valueFromTable, filterArgument, filterType);

                            if (!match) {
                                break;
                            }

                        };

                    } else {

                        if (excludeEmptyCells && flItem.___type !== 'group') { // if user choose to hide empty cells
                            match = false;
                        } else {
                            match = true;
                        }
                    };

                };

            };

            return match;

        });
    };

    var filterValueFromTable = function (valueToFilter, filterBy, operationType) {

        switch (operationType) {

            case 'contains':
                if (valueToFilter.indexOf(filterBy) !== -1) {
                    return true;
                }
                break;

            case 'does_not_contains':
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

            /*case 'top_n':
                if (valueToFilter < filterBy) {
                    return true;
                }
                break;

            case 'bottom_n':
                if (valueToFilter > filterBy) {
                    return true;
                }
                break;*/

            case 'from_to':
                var minValue = filterBy.min_value;
                var maxValue = filterBy.max_value;

                if (valueToFilter >= minValue && valueToFilter <= maxValue) {
                    return true;
                }
                break;

            case 'multiselector':

                if (filterBy.indexOf(valueToFilter) !== -1) {
                    return true;
                }
                break;

            case 'date_tree':

                var d;
                for (d = 0; d < filterBy.length; d++) {

                    if (valueToFilter.toDateString() === new Date(filterBy[d]).toDateString()) {
                        return true;
                    }

                }
                break;

        };

        return false;

    };

    module.exports = {
        filterTableRows: filterTableRows
    }

}());