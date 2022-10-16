/**
 * Created by szhitenev on 15.10.2022.
 */
(function () {

    'use strict';

    var baseUrlService = require('../../services/baseUrlService');
    var dataStatsService = require('../../services/dataStatsService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function dataStatsController($scope, authorizerService, globalDataService, $mdDialog) {

        var vm = this;

        vm.showGeneralSection = true;
        vm.showPriceHistorySection = false;
        vm.showCurrencyHistorySection = false;
        vm.showNavHistorySection = false;
        vm.showPlHistorySection = false;
        vm.showWidgetStatsSection = false;

        vm.showInstruments = false;
        vm.showCurrencies = false;
        vm.showNavPortfolios = false;
        vm.showPlPortfolios = false;
        vm.showWidgetStatsPortfolios = false;

        vm.readyStatus = {content: false};

        vm.init = function () {

            dataStatsService.getStats().then(function (data){

                vm.stats = data;

                console.log('vm.stats', vm.stats);

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.init();

    };

}());