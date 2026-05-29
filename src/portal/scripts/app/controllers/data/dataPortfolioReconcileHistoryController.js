'use strict';

export default function ($scope, priceHistoryService) {

    var vm = this;

    vm.entityType = 'portfolio-reconcile-history'; // deprecated
    vm.contentType = 'portfolios.portfolioreconcilehistory';

    vm.entityRaw = [];

    vm.readyStatus = {content: false};

    vm.entityViewer = {extraFeatures: []};


    vm.init = function () {
        vm.readyStatus.content = true
    };

    vm.init()

};