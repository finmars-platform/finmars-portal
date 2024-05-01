/**
 * Created by szhitenev on 01.06.2023.
 */
(function () {

    'use strict';

    var marketplaceService = require('../../services/marketplaceService');


    module.exports = function marketplaceConfigurationDialog($scope, $mdDialog, globalDataService, toastNotificationService, configurationService, data) {

        var vm = this;

        vm.processing = false;
        vm.channel = 'stable';

        vm.readyStatus = {data: false};

        vm.item = {}

        vm.checkReadyStatus = function () {
            return vm.readyStatus.data;
        };

        // TODO move to separate service to keep it DRY
        vm.alphabets = [
            '#357EC7', // A
            '#C11B17', // B
            '#008080', // C
            '#728C00', // D
            '#0020C2', // E
            '#347C17', // F
            '#D4A017', // G
            '#7D0552', // H
            '#9F000F', // I
            '#E42217', // J
            '#F52887', // K
            '#571B7E', // L
            '#1F45FC', // M
            '#C35817', // N
            '#F87217', // O
            '#41A317', // P
            '#4C4646', // Q
            '#4CC417', // R
            '#C12869', // S
            '#15317E', // T
            '#AF7817', // U
            '#F75D59', // V
            '#FF0000', // W
            '#000000', // X
            '#E9AB17', // Y
            '#8D38C9' // Z
        ]

        vm.getAvatar = function (char) {

            let charCode = char.charCodeAt(0);
            let charIndex = charCode - 65

            let colorIndex = charIndex % vm.alphabets.length;

            return vm.alphabets[colorIndex]

        }

        vm.getItem = function (id) {

            marketplaceService.getByKey(id).then(function (data) {

                vm.item = data
                vm.readyStatus.data = true;

                vm.localItems.forEach(function (localItem) {

                    if (vm.item.configuration_code === localItem.configuration_code) {
                        vm.item.localItem = localItem; // TODO refactor to get local item in case if there is more then 1 page of configuration
                    }

                })

                vm.getVersions();

                $scope.$apply();

            });
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


        vm.agree = function ($event) {

            vm.processing = true;

            if (vm.item.id) {

                vm.item.manifest = JSON.parse(vm.editor.getValue());

                configurationService.update(vm.item.id, vm.item).then(function (data) {

                    toastNotificationService.success("Configuration " + vm.item.user_code + ' was successfully saved');

                    vm.processing = false;

                    $mdDialog.hide({status: 'agree'});

                })
            } else {

                vm.generateManifestIfNotExists()

                configurationService.create(vm.item).then(function (data) {

                    // vm.item = data;

                    toastNotificationService.success("Configuration " + vm.item.user_code + ' was successfully created');

                    /*vm.processing = false;

                    vm.getItem(vm.item.id)*/
                    $mdDialog.hide({status: 'agree', data: {configurationId: data.id}});

                })

            }

        };

        vm.installConfiguration = function ($event, item) {

            console.log("Install configuration", item);

            configurationService.installConfiguration({
                configuration_code: item.configuration_code,
                channel: vm.channel,
                version: vm.version,
                is_package: item.is_package
            }).then(function (data) {

                toastNotificationService.info("Configuration is installing");

            })

        }

        vm.getLocalConfigurations = function ($event, item) {

            configurationService.getList().then(function (data) {

                vm.localItems = data.results;

                vm.getItem(vm.id);


            })
        }

        vm.getVersions = function () {

            vm.versions = []

            marketplaceService.getVersions(
                {
                    pageSize: 10,
                    page: 1,
                    filters: {configuration_code: vm.item.configuration_code, channel: vm.channel},
                    sort: {
                        direction: "DESC",
                        key: "created"
                    }
                }
            ).then(function (data) {

                vm.versions = data.results;

                if (vm.versions && vm.versions.length) {
                    vm.version = vm.versions[0].version
                }

                $scope.$apply();

            });

        }


        vm.init = function () {

            vm.id = data.id;

            vm.getLocalConfigurations();


            vm.member = globalDataService.getMember()

        };

        vm.init();

    };

}());