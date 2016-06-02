/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var setFilters = function (items, filters) {
        console.log('FILTERING', items, filters);

        if (filters.length) {
            var itemsFiltered = [];

            var i, f, item, filter, accepted = true;

            for (i = 0; i < items.length; i = i + 1) {
                item = items[i];
                accepted = true;
                for (f = 0; f < filters.length; f = f + 1) {
                    filter = filters[f];
                    if(!filter.options) {
                        filter.options = {enabled: true, query: ''};
                    }
                    console.log('filter', filter);
                    if (filter.options.enabled) {
                        if(filter.options.query) {
                            if(filter.key) {
                                if (item[filter.key].toLocaleLowerCase().indexOf(filter.options.query.toLocaleLowerCase()) == -1) {
                                    accepted = false;
                                }
                            } else {
                                if (item[filter.name].toLocaleLowerCase().indexOf(filter.options.query.toLocaleLowerCase()) == -1) {
                                    accepted = false;
                                }
                            }
                        }
                    }
                }
                if(accepted) {
                    itemsFiltered.push(item);
                }
            }

            console.log('itemsFiltered', itemsFiltered);

            return itemsFiltered;
        } else {
            return items;
        }
    };

    module.exports = {
        setFilters: setFilters
    }

}());