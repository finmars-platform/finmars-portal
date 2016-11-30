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

        auditService.getList({filters: {'content_type': 'transactions.transaction'}}).then(function (data) {
            var formattedData = data.results.map(function (item) {
                item.dateFormatted = moment(new Date(item.created)).format('DD/MM/YYYY');
                item.username = item.member.username;
                return item;
            });
            vm.entityRaw = formattedData;
            console.log('audit date is', vm.entityRaw);
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