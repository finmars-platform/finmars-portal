/**
 * Created by szhitenev on 24.06.2016.
 */
(function(){

    'use strict';

    function configureUrl(url, options) {
        if(options) {
            if(options.sort) {
                if(options.sort.direction === 'ASC') {
                    url = url + '?ordering=' + options.sort.key
                } else {
                    url = url + '?ordering=-' + options.sort.key
                }
            }
        }
        return url
    }

    module.exports = {
        configureUrl: configureUrl
    }

}());