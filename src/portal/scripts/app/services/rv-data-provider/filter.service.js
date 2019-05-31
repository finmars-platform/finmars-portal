(function () {

    var filterByText = function (items, regularFilters, filterType) {
        console.log("filter filter.service filterByText", items, regularFilters, filterType);
        var match;

        return items.filter(function (item) {

            match = true;

            Object.keys(regularFilters).forEach(function (key) {

                if (key !== 'ordering') {

                    if (item.hasOwnProperty(key) && item[key]) {

                        if (filterType === 'contain') {

                            if (item[key].toString().toLowerCase().indexOf(regularFilters[key].toLowerCase()) === -1) {
                                match = false;
                            }

                        } else if (filterType === 'does_not_contain') {
                            if (item[key].toString().toLowerCase().indexOf(regularFilters[key].toLowerCase()) !== -1) {
                                match = false;
                            }
                        }

                    } else {
                        match = false;
                    }

                }

            });

            return match

        });

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

            if (['groups_order', 'groups_types', 'groups_values', 'page', 'page_size', 'filter_type'].indexOf(key) === -1) {

                result[key] = options[key];
                console.log("filter getRegularFilters result", options, key);
            }

        });

        return result;

    };

    module.exports = {
        filterByText: filterByText,
        filterByRegularFilters: filterByRegularFilters,
        filterByGroupsFilters: filterByGroupsFilters,
        getRegularFilters: getRegularFilters
    }

}());