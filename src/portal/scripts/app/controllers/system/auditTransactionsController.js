(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var auditService = require('../../services/auditService');

    module.exports = function ($scope) {

        logService.controller('AuditController', 'initialized');

        var vm = this;
        var vm = this;

        vm.entityType = 'audit-transaction';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

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
    };

}());