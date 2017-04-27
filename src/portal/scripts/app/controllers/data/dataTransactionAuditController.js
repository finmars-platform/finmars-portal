/**
 * Created by szhitenev on 15.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var auditService = require('../../services/auditService');

    module.exports = function ($scope) {

        console.log('{"controller": "DataInstrumentController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'audit-transaction';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        vm.components = {
            sidebar: true,
            groupingArea: true,
            columnAreaHeader: true,
            splitPanel: true,
            addEntityBtn: false,
            fieldManagerBtn: true,
            layoutManager: true,
            autoReportRequest: false
        };

        auditService.getList({filters: {'content_type': 'transactions.transaction'}}).then(function (data) {
            vm.entityRaw = data;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function (options) {
            return auditService.getList(options).then(function (data) {
                return data;
            })
        }

    }

}());