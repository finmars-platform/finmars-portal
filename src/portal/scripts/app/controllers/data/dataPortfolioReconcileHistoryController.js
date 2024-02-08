/**
 * Created by szhitenev on 03.02.2024.
 */
(function () {

    'use strict';

    module.exports = function ($scope, priceHistoryService) {

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

    }

}());