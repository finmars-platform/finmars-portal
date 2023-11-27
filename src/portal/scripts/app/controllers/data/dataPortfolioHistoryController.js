/**
 * Created by szhitenev on 19.11.2023.
 */
(function(){

    'use strict';

    module.exports = function($scope, priceHistoryService){

        console.log('{"controller": "DataPortfolioHistoryController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'portfolio-history'; // deprecated
        vm.contentType = 'portfolios.portfoliohistory';

        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};


        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());