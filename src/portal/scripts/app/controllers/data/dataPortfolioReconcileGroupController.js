/**
 * Created by szhitenev on 02.02.2024.
 */
(function () {

    'use strict';

    var portfolioReconcileGroupService = require('../../services/portfolioReconcileGroupService');

    module.exports = function ($scope) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.entityType = 'portfolio-reconcile-group'; // deprecated
        vm.contentType = 'portfolios.portfolioreconcilegroup';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        vm.getList = function (options) {
            return portfolioReconcileGroupService.getListLight(options).then(function (data) {
                return data;
            })
        };

        vm.init = function () {
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());