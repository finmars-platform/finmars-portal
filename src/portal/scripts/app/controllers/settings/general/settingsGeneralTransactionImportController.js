/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    module.exports = function (transactionImportSchemeService) {

        var vm = this;

        vm.entityType = 'complex-transaction-import-scheme';
        vm.contentType = 'integrations.complextransactionimportscheme';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        vm.getList = function (options) {
            return transactionImportSchemeService.getList(options).then(function (data) {
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());