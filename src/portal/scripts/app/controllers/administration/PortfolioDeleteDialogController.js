/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('../../services/portfolioService');

    module.exports = function ($scope, $mdDialog, portfolio) {

        var vm = this;
        vm.portfolio = portfolio;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.delete = function () {
            portfolioService.deleteByKey(vm.portfolio.id).then(function () {
                $mdDialog.hide();
            });
        };




    }

}());