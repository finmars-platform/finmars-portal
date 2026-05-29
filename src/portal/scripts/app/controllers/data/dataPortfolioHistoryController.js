'use strict';

export default function($scope, priceHistoryService){

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

};