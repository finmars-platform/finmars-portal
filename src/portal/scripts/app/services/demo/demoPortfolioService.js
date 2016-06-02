/**
 * Created by sergey on 14.05.16.
 */
(function(){

    'use strict';

    var demoPortfolioRepository = require('../../repositories/demo/demoPortfolioRepository');

    var getView = function(){
        return demoPortfolioRepository.getView();
    };

    var save = function(tabs){
        return demoPortfolioRepository.save(tabs);
    };

    module.exports = {
        getView: getView,
        save: save
    }

}());