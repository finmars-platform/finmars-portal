(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var auditService = require('../../services/auditService');

    module.exports = function ($scope) {

        logService.controller('AuditController', 'initialized');

        var vm = this;

        vm.entityType = 'audit-instrument';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        auditService.getList({filters: {'content_type': 'instruments.instrument'}}).then(function (data) {
            vm.entityRaw = data;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

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

        vm.getList = function (options) {
            return auditService.getList(options).then(function (data) {
                return data;
            })
        }
    };

}());