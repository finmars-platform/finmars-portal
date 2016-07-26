/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

    'use strict';

    function configureUrl(url, options) {
        if (options) {
            if (options.sort) {
                if (options.sort.direction === 'ASC') {
                    url = url + '?ordering=' + options.sort.key
                } else {
                    url = url + '?ordering=-' + options.sort.key
                }
            }
            var keys = [];
            if (options.filters && options.sort) {
                keys = Object.keys(options.filters);
                keys.forEach(function (item) {
                    if (options.filters[item]) {
                        url = url + '&' + item + '=' + options.filters[item];
                    }
                })
            }
            if (options.filters && !options.sort) {
                keys = Object.keys(options.filters);
                keys.forEach(function (item, i) {
                    if (i === 0) {
                        console.log('options.filters[item]', options.filters[item]);
                        url = url + '?' + item + '=' + options.filters[item];
                    } else {
                        url = url + '&' + item + '=' + options.filters[item];
                    }
                })
            }

            if(options.page) {
                url = url + '&page=' + options.page;
            }
        }
        return url
    }

    module.exports = {
        configureUrl: configureUrl
    }

}());