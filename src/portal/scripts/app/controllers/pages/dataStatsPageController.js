/**
 * Created by szhitenev on 15.10.2022.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;
    // var baseUrlService = require('../../services/baseUrlService');
    var dataStatsService = require('../../services/dataStatsService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;

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

        vm.period = 'this_year';

        vm.readyStatus = {content: false};

        vm.getData = function () {
            
            vm.readyStatus.content = false;

            dataStatsService.getStats(vm.period).then(function (data) {

                vm.stats = data;

                console.log('vm.stats', vm.stats);

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        }

        vm.init = function () {

            vm.getData()
        };

        vm.init();

    };

}());