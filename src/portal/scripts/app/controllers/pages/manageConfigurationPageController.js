/**
 * Created by szhitenev on 15.04.2023.
 */

(function () {

    'use strict';

    module.exports = function manageConfigurationPageController($scope, $state, $stateParams, $mdDialog, configurationService) {

        const vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.filters = {}

        vm.currentPage = 1;
        vm.pageSize = 40;

        vm.pages = []

        vm.openPreviousPage = function () {

            vm.currentPage = vm.currentPage - 1;

            $state.go('app.portal.manage-configuration', {
                page: vm.currentPage,
                query: vm.filters.query,
            }, {notify: false});

            vm.getData()

        }

        vm.openNextPage = function () {

            vm.currentPage = vm.currentPage + 1;

            $state.go('app.portal.manage-configuration', {
                page: vm.currentPage,
                query: vm.filters.query,
            }, {notify: false});

            vm.getData()

        }

        vm.openPage = function (page) {

            if (page.number) {

                vm.currentPage = page.number;

                $state.go('app.portal.manage-configuration', {
                    page: vm.currentPage,
                    query: vm.filters.query,
                }, {notify: false});

                vm.getData();
            }

        }

        vm.updateFilters = function () {

            vm.currentPage = 1;

            $state.go('app.portal.manage-configuration', {
                page: vm.currentPage,
                query: vm.filters.query,
            }, {notify: false});

            vm.getData();

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

            return new Promise(function (resolve, reject) {

                configurationService.getList({
                    pageSize: vm.pageSize,
                    page: vm.currentPage,
                    filters: vm.filters,
                    sort: {
                        direction: "DESC",
                        key: "created"
                    }
                }).then(function (data) {

                    vm.generatePages(data)

                    vm.items = data.results;
                    vm.count = data.count;

                    if (vm.items.length) {
                        vm.activeConfiguration = vm.items[0];
                    }


                    vm.readyStatus.data = true;

                    resolve();

                    $scope.$apply();

                })

            })

        };

        vm.editConfiguration = function ($event, item) {

            $mdDialog.show({
                controller: 'ConfigurationDialogController as vm',
                templateUrl: 'views/dialogs/configuration-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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

        vm.createConfiguration = function ($event) {

            $mdDialog.show({
                controller: 'ConfigurationDialogController as vm',
                templateUrl: 'views/dialogs/configuration-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                locals: {
                    data: {}
                },
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.getData().then(function () {

                        const createdConfig = vm.items.find(item => item.id === res.data.configurationId);

                        vm.editConfiguration($event, createdConfig);

                    });

                }

            });

        }

        vm.init = function () {

            console.log('$stateParams', $stateParams);

            if ($stateParams.query) {
                vm.filters.query = $stateParams.query
            }

            vm.getData()

        };

        vm.init();

    };

}());