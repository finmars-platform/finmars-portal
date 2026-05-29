'use strict';

import importPricingRepository from '../../repositories/import/importPricingRepository';

var create = function(price){
    return importPricingRepository.create(price);
};


export default {
    create: create
};