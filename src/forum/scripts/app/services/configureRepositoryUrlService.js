/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

    'use strict';

    function entityPluralToSingular(key) {
        switch (key) {
            case 'instruments':
                return 'instrument';
            case 'accounts':
                return 'account';
                break;
            case 'portfolios':
                return 'portfolio';
                break;
            case 'responsibles':
                return 'responsible';
                break;
            case 'counterparties':
                return 'counterparty';
                break;
            case 'tags':
                return 'tag';
            default:
                return key;
                break;
        }
    }

    function configureUrl(url, options) {

        //console.log('OPTIOPNS', options);

        if (options) {

            url = url + '?page_size=' + options.pageSize;

            var keys = [];

            if (options.hasOwnProperty('filters')) {
                keys = Object.keys(options.filters);
                keys.forEach(function (keysItem) {
                    if (options.filters[keysItem]) {
                        var filterItems = options.filters[keysItem];
                        if (typeof filterItems === 'string' || typeof filterItems === 'number') {
                            url = url + '&' + entityPluralToSingular(keysItem) + '=' + filterItems;
                        } else {
                            filterItems.map(function (filterItem, index) {
                                url = url + '&' + entityPluralToSingular(keysItem) + '=' + filterItem;
                            })
                        }
                    }
                })
            }

            if (options.hasOwnProperty('sort')) {
                if (options.sort.direction === 'ASC') {
                    url = url + '&ordering=' + options.sort.key
                } else {
                    url = url + '&ordering=-' + options.sort.key
                }
            }

            if (options.hasOwnProperty('page')) {
                url = url + '&page=' + options.page;
            }


            //console.log('URL------------------', url);
        }
        return url
    }

    module.exports = {
        configureUrl: configureUrl
    }

}());