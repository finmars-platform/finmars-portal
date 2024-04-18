/**
 * Created by szhitenev on 02.02.2024.
 */
(function () {

    'use strict';

    var portfolioTypeService = require('../../services/portfolioTypeService');

    module.exports = function ($scope) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.entityType = 'portfolio-type'; // deprecated
        vm.contentType = 'portfolios.portfoliotype';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        vm.getList = function (options) {
            return portfolioTypeService.getListLight(options).then(function (data) {
                return data;
            })
        };

        vm.init = function () {
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());