/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var dataProvidersService = require('../../services/import/dataProvidersService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var instrumentService = require('../../services/instrumentService');

    var importInstrumentService = require('../../services/import/importInstrumentService');
    var importPricingService = require('../../services/import/importPricingService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('FillPriceHistoryDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {mapping: false, processing: false};

        var d = new Date();
        d = new Date(d.setDate(d.getDate() - 1));

        vm.price = {
            date_from: d,
            date_to: d
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.automatedUploads = function ($event) {
            $mdDialog.show({
                controller: 'AutomatedUploadsHistoryDialogController as vm',
                templateUrl: 'views/dialogs/automated-uploads-history-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);

                }
            });
        };

        vm.uploadPrice = function(){
            vm.processing = true;

            var price = {};
            if(vm.price.isRange) {
                price = {
                    date_from: moment(new Date(vm.price.date_from)).format('YYYY-MM-DD'),
                    date_to: moment(new Date(vm.price.date_to)).format('YYYY-MM-DD'),
                    balance_date: moment(new Date(vm.price.balance_date)).format('YYYY-MM-DD'),
                    fill_days: vm.price.fill_days,
                    override_existed: vm.price.override_existed
                };
            } else {
                price = {
                    date_from: moment(new Date(vm.price.date_both)).format('YYYY-MM-DD'),
                    date_to: moment(new Date(vm.price.date_both)).format('YYYY-MM-DD'),
                    balance_date: moment(new Date(vm.price.balance_date)).format('YYYY-MM-DD'),
                    fill_days: vm.price.fill_days,
                    override_existed: vm.price.override_existed
                };
            }

            importPricingService.create(price).then(function(){
                vm.processing = false;
            })
        };

        vm.agree = function () {
        };

    };

}());