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

        }

        vm.getSecrets = function (engine) {

            vaultService.getListSecrets(engine['engine_name']).then(function (data) {

                console.log('vm.getSecrets.data', data);

                var secrets_keys = data['data']['keys']

                var secret_items = []

                secrets_keys.forEach(function (key) {

                    secret_items.push({
                        path: key
                    })
                })

                engine.secrets = secret_items;
                $scope.$apply();

            })

        }


        vm.getData = function () {

            vm.readyStatus.data = false;

            vaultService.getListEngines().then(function (data) {

                console.log('vm.getListEngines.data', data);

                vm.engines = data;

                vm.engines.forEach(function (engine) {

                    vm.getSecrets(engine);

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