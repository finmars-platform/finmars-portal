/**
 * Created by szhitenev on 25.08.2016.
 */
(function(){

    'use strict';

    var importPricingRepository = require('../../repositories/import/importPricingRepository');

    var create = function(price){
        return importPricingRepository.create(price);
    };


    module.exports = {
        create: create
    }

}());