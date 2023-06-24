/**
 * Created by szhitenev on 24.06.2023.
 */
(function () {

    'use strict';

    var historyService = require('../../services/historyService');
    var configurationService = require('../../services/configurationService');
    var vaultService = require('../../services/vaultService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function vaultPageController($scope, $state, $stateParams, $mdDialog, configurationService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.filters = {}

        vm.toggleShowSecrets = function (item) {

            item.showSecrets = !item.showSecrets;

            if (item.showSecrets) {

                vaultService.getListSecrets(engine['engine_name']).then(function (data){

                    console.log('vm.getSecrets.data', data);

                    secrets_keys = data['data']['keys']

                    secret_items = []

                    secrets_keys.forEach(function(key) {

                        secret_items.push({
                            path: key
                        })
                    })

                    item.secrets = secret_items;
                    $scope.$apply();

                })

            }

        }


        vm.getData = function () {

            vm.readyStatus.data = false;

            vaultService.getListEngines().then(function (data){

                console.log('vm.getListEngines.data', data);

                vm.engines = [];

                Object.keys(data).forEach(function(key) {

                    var item = data[key];

                    item['engine_name'] = key

                    vm.engines.push(item)

                })

                vm.readyStatus.data = true;

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();

    };

}());