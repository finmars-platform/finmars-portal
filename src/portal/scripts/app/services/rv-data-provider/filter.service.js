(function () {

    var filterByRegularFilters = function (items, regularFilters) {

        // console.log('filterItems.regularFilters', regularFilters);

        var match;

        return items.filter(function (item) {

            match = true;

            Object.keys(regularFilters).forEach(function (key) {

                if (key !== 'ordering' && item[key].toString().indexOf(regularFilters[key]) === -1) {
                    match = false;
                }

            });

            return match

        });

    };

    var filterByGroupsFilters = function (items, options) {

        var i;

        if (options.groups_values.length) {

            var match;

            var key;
            var value;

            items = items.filter(function (item) {

                match = true;

                for (i = 0; i < options.groups_values.length; i = i + 1) {

                    key = options.groups_types[i];
                    value = options.groups_values[i];

                    // console.log('item[key]', item[key]);
                    // console.log('key', key);
                    // console.log('value', value);

                    if (value === '-') {

                        if (item[key] !== null && item[key] !== undefined && item[key] !== '-') {
                            match = false;
                        }

                    } else {

                        if (!item.hasOwnProperty(key) || item[key].toString().indexOf(value) === -1) {
                            match = false;
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