/**
 * Created by szhitenev on 15.04.2023.
 */
(function () {

    'use strict';

    var historyService = require('../../services/historyService');
    var configurationService = require('../../services/configurationService');
    var marketplaceService = require('../../services/marketplaceService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function marketplacePageController($scope, $state, $stateParams, $mdDialog, configurationService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.filters = {}

        vm.currentPage = 1;
        vm.pageSize = 40;
        vm.showModules = false;

        vm.pages = []

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

        vm.openPreviousPage = function () {

            vm.currentPage = vm.currentPage - 1;

            $state.go('app.portal.marketplace', {
                page: vm.currentPage,
                query: vm.filters.query,
            }, {notify: false});

            vm.getData()

        }

        vm.openNextPage = function () {

            vm.currentPage = vm.currentPage + 1;

            $state.go('app.portal.marketplace', {
                page: vm.currentPage,
                query: vm.filters.query,
            }, {notify: false});

            vm.getData()

        }

        vm.openPage = function (page) {

            if (page.number) {

                vm.currentPage = page.number;

                $state.go('app.portal.marketplace', {
                    page: vm.currentPage,
                    query: vm.filters.query,
                }, {notify: false});

                vm.getData();
            }

        }

        vm.updateFilters = function () {

            vm.currentPage = 1;

            $state.go('app.portal.marketplace', {
                page: vm.currentPage,
                query: vm.filters.query,
            }, {notify: false});

            vm.getData();

        }

        vm.openConfigurationItem = function ($event, item) {

            $mdDialog.show({
                controller: 'MarketplaceConfigurationDialogController as vm',
                templateUrl: 'views/dialogs/marketplace-configuration-dialog-view.html',
                locals: {
                    data: {
                        id: item.id
                    }
                },
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.getData();

                }

            });

        }

        vm.generatePages = function (data) {

            vm.totalPages = Math.ceil(data.count / vm.pageSize)

            vm.pages = []

            for (var i = 1; i <= vm.totalPages; i = i + 1) {
                vm.pages.push({
                    number: i,
                    caption: i.toString()
                })

            }

            if (vm.totalPages > 10) {

                vm.currentPageIndex = 0;

                vm.pages.forEach(function (item, index) {

                    if (vm.currentPage === item.number) {
                        vm.currentPageIndex = index;
                    }

                })

                vm.pages = vm.pages.filter(function (item, index) {

                    if (index < 2 || index > vm.totalPages - 3) {
                        return true
                    }

                    if (index === vm.currentPageIndex) {
                        return true
                    }

                    if (index > vm.currentPageIndex - 3 && index < vm.currentPageIndex) {
                        return true
                    }

                    if (index < vm.currentPageIndex + 3 && index > vm.currentPageIndex) {
                        return true
                    }

                    return false

                })

                for (var i = 0; i < vm.pages.length; i = i + 1) {

                    var j = i + 1;

                    if (j < vm.pages.length) {

                        if (vm.pages[j].number && vm.pages[i].number) {
                            if (vm.pages[j].number - vm.pages[i].number > 1) {


                                vm.pages.splice(i + 1, 0, {
                                    caption: '...'
                                })

                            }
                        }

                    }

                }


            }

        }


        vm.getData = function () {

            vm.readyStatus.data = false;

            if (vm.showModules) {
                delete vm.filters['is_package']
            } else {
                vm.filters['is_package'] = true
            }

            return new Promise(function (resolve, reject) {

                marketplaceService.getList({
                    pageSize: vm.pageSize,
                    page: vm.currentPage,
                    filters: vm.filters,
                    sort: {
                        direction: "DESC",
                        key: "created"
                    }
                }).then(function (data) {

                    vm.generatePages(data);

                    vm.items = data.results;
                    vm.count = data.count;

                    vm.items.forEach(function (remoteItem) {

                        vm.localItems.forEach(function (localItem) {

                            if (remoteItem.configuration_code === localItem.configuration_code) {
                                remoteItem.localItem = localItem;
                            }

                        })

                    })


                    vm.readyStatus.data = true;

                    resolve();

                    $scope.$apply();


                })

            })

        };

        vm.installConfiguration = function ($event, item) {

            $event.preventDefault();
            $event.stopPropagation();

            console.log("Install configuration", item);

            configurationService.installConfiguration({
                configuration_code: item.configuration_code,
                version: item.latest_release_object.version,
                is_package: item.is_package
            }).then(function (data) {

                vm.activeTaskId = data.task_id

                $scope.$apply();

                toastNotificationService.info("Configuration is installing");

            })

        }

        vm.getLocalConfigurations = function ($event, item) {

            configurationService.getList().then(function (data) {

                vm.localItems = data.results;

                vm.getData();

            })
        }

        vm.init = function () {

            vm.getLocalConfigurations();

            console.log('$stateParams', $stateParams);

            if ($stateParams.query) {
                vm.filters.query = $stateParams.query
            }


        };

        vm.init();

    };

}());