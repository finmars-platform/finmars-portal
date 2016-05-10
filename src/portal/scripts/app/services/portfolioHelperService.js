/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('./portfolioService');

    var transformItems = function (items) {
        return new Promise(function(resolve, reject){
            var transformedItems = [];
            portfolioService.getAttributeTypeList().then(function(data){
                var attrs = data.results;
                var i, x;
                console.log('attrs', attrs);
                transformedItems = items.map(function(item){
                    for(i = 0; i < attrs.length; i = i + 1) {
                        for(x = 0; x < item.attributes.length; x = x + 1) {
                            if(item.attributes[x]['attribute_type'] === attrs[i].id) {
                                item[attrs[i].name] = item.attributes[x]['value_string']; //TODO Add value checker
                            }
                        }
                    }
                    return item;
                });
                console.log('Items transformed', transformedItems);
                resolve(transformedItems);
            })
        });

    };

    module.exports = {
        transformItems: transformItems
    }

}());