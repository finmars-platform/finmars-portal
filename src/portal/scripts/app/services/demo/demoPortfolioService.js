/**
 * Created by sergey on 14.05.16.
 */
(function(){

    'use strict';

    var demoPortfolioRepository = require('../../repositories/demo/demoPortfolioRepository');

    var getTabList = function(){
        return demoPortfolioRepository.getTabList();
    };

    var save = function(tabs){
        return demoPortfolioRepository.save(tabs);
    };

    module.exports = {
        getTabList: getTabList,
        save: save
    }

}());