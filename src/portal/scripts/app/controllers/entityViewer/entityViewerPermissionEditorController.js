/**
 * Created by szhitenev on 09.01.2017.
 */
(function () {

    'use strict';

    var usersGroupService = require('../../services/usersGroupService');
    var entityResolverService = require('../../services/entityResolverService');
    var complexTransactionService = require('../../services/transaction/complexTransactionService');
    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($scope, $mdDialog, $transitions, parentEntityViewerDataService, parentEntityViewerEventService, splitPanelExchangeService) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.processing = false;
        vm.activeGroup = null;
        vm.isSaved = false;

        vm.selectedRows = [];

        vm.isManageChecked = false;
        vm.isManageIndeterminate = false;

        vm.isChangeChecked = false;
        vm.isChangeIndeterminate = false;

        vm.isViewChecked = false;
        vm.isViewIndeterminate = false;

        vm.getGroups = function () {

            vm.readyStatus.content = false;

            usersGroupService.getList().then(function (data) {

                vm.groups = data.results.filter(function (item) {

                    return item.role === 2;

                });


                vm.readyStatus.content = true;

                $scope.$apply();
            })

        };

        vm.getSelectedRows = function () {

            var list = parentEntityViewerDataService.getFlatList();

            return list.filter(function (item) {
                return item.___is_activated
            })


        };

        vm.setActiveGroup = function ($event, group) {

            vm.activeGroup = group;
            vm.isSaved = false;

            if (!$event.target.classList.contains('md-container')) {

                vm.selectedRows = vm.getSelectedRows();

                if (vm.selectedRows.length) {
                    vm.updateStates();
                }

            }

        };

        vm.updatePermissions = function ($event, items) {

            vm.processing = true;

            return new Promise(function (resolve, reject) {

                entityResolverService.updateBulk(vm.entityType, items).then(function () {

                    vm.processing = false;

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Permissions successfully updated"
                            }
                        }
                    });

                    resolve();



                })

            })



        };

        vm.recalculateTransactionPermissions = function ($event) {

            vm.recalculating = true;
            vm.isSaved = false;

            console.log("Recalculate");

            var config = {
                // content_type: 'portfolios.portfolio'
            };

            // TODO make it recursive like transaction import

            complexTransactionService.recalculatePermissionTransaction(config).then(function (value) {

                vm.recalculating = false;

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Success',
                            description: "Transaction Permissions successfully recalculated"
                        }
                    }
                });

                $scope.$apply();

                console.log("Recalculate done");

            })

        };

        vm.recalculateInstrumentPermissions = function($event){

            vm.recalculating = true;
            vm.isSaved = false;

            entityResolverService.getList('instrument', {pageSize: 1000}).then(function (data) {

                console.log('data', data);

                var instrumentsWithPermissions = data.results.map(function (item) {

                    return {
                        id: item.id,
                        object_permissions: item.instrument_type_object.object_permissions.map(function (item) {

                            item.permission = item.permission.split('_')[0] + '_instrument';

                            return item

                        })
                    }

                });

                entityResolverService.updateBulk('instrument', instrumentsWithPermissions).then(function () {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Instrument Permissions successfully updated"
                            }
                        }
                    });

                    vm.recalculating = false;
                    $scope.$apply();

                });

            });

        };

        vm.recalculateAccountPermissions = function($event) {

            vm.recalculating = true;
            vm.isSaved = false;

            entityResolverService.getList('account', {pageSize: 1000}).then(function (data) {

                console.log('data', data);

                var accountsWithPermissions = data.results.map(function (item) {

                    return {
                        id: item.id,
                        object_permissions: item.type_object.object_permissions.map(function (item) {

                            item.permission = item.permission.split('_')[0] + '_account';

                            return item

                        })
                    }

                });

                entityResolverService.updateBulk('account', accountsWithPermissions).then(function () {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Accounts Permissions successfully updated"
                            }
                        }
                    });

                    vm.recalculating = false;
                    $scope.$apply();

                })


            })


        };

        vm.recalculateAccountAndTransactionsPermissions = function($event) {

            vm.recalculating = true;
            vm.isSaved = false;

            entityResolverService.getList('account', {pageSize: 1000}).then(function (data) {

                console.log('data', data);

                var accountsWithPermissions = data.results.map(function (item) {

                    return {
                        id: item.id,
                        object_permissions: item.type_object.object_permissions.map(function (item) {

                            item.permission = item.permission.split('_')[0] + '_account';

                            return item

                        })
                    }

                });

                entityResolverService.updateBulk('account', accountsWithPermissions).then(function () {

                    complexTransactionService.recalculatePermissionTransaction().then(function (value) {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            locals: {
                                info: {
                                    title: 'Success',
                                    description: "Accounts Permissions and Transaction Permissions successfully updated"
                                }
                            }
                        });

                        vm.recalculating = false;
                        $scope.$apply();


                    })

                })


            })

        };

        vm.getPermissionsFromState = function () {

            var result = [];
            var obj;

            var manage_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();
            var change_code = "change_" + vm.entityType.split('-').join('').toLowerCase();
            var view_code = "view_" + vm.entityType.split('-').join('').toLowerCase();

            vm.selectedRows.forEach(function (item) {

                obj = {id: item.id, object_permissions: []};

                item.object_permissions.forEach(function (perm) {

                    if (perm.group === vm.activeGroup.id) {

                        if (perm.permission.indexOf('manage') !== -1 && vm.isManageIndeterminate) {
                            obj.object_permissions.push(perm)
                        }

                        if (perm.permission.indexOf('change') !== -1 && vm.isChangeIndeterminate) {
                            obj.object_permissions.push(perm)
                        }

                        if (perm.permission.indexOf('view') !== -1 && vm.isViewIndeterminate) {
                            obj.object_permissions.push(perm)
                        }

                    } else {
                        obj.object_permissions.push(perm)
                    }


                });

                if (vm.isManageChecked) {
                    obj.object_permissions.push({
                        group: vm.activeGroup.id,
                        member: null,
                        permission: manage_code
                    })
                }

                if (vm.isChangeChecked) {
                    obj.object_permissions.push({
                        group: vm.activeGroup.id,
                        member: null,
                        permission: change_code
                    })
                }

                if (vm.isViewChecked) {
                    obj.object_permissions.push({
                        group: vm.activeGroup.id,
                        member: null,
                        permission: view_code
                    })
                }

                result.push(obj);

            });


            return result;

        };

        vm.save = function ($event) {

            var permissions = vm.getPermissionsFromState();

            console.log('permissions', permissions);

            vm.updatePermissions($event, permissions).then(function (value) {

                parentEntityViewerDataService.resetData();
                parentEntityViewerDataService.resetRequestParameters();

                var rootGroup = parentEntityViewerDataService.getRootGroupData();

                parentEntityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                vm.isSaved = true;

                console.log('isSaved', vm.isSaved);

                $scope.$apply();

            })

        };

        vm.toggleManage = function ($event) {

            vm.isManageChecked = !vm.isManageChecked;
            vm.isManageIndeterminate = false;
            vm.isSaved = false;

        };

        vm.toggleChange = function ($event) {

            vm.isChangeChecked = !vm.isChangeChecked;
            vm.isChangeIndeterminate = false;
            vm.isSaved = false;

        };

        vm.toggleView = function ($event) {

            vm.isViewChecked = !vm.isViewChecked;
            vm.isViewIndeterminate = false;
            vm.isSaved = false;

        };

        vm.updateStates = function () {

            console.time("Update States");

            vm.isManageChecked = false;
            vm.isManageIndeterminate = false;

            vm.isChangeChecked = false;
            vm.isChangeIndeterminate = false;

            vm.isViewChecked = false;
            vm.isViewIndeterminate = false;

            var managePermCount = 0;
            var changePermCount = 0;
            var viewPermCount = 0;

            vm.selectedRows.forEach(function (item) {

                item.object_permissions.forEach(function (perm) {

                    if (vm.activeGroup.id === perm.group) {

                        if (perm.permission.indexOf('manage_') !== -1) {

                            vm.isManageIndeterminate = true;

                            managePermCount = managePermCount + 1

                        }

                        if (perm.permission.indexOf('change_') !== -1) {

                            vm.isChangeIndeterminate = true;

                            changePermCount = changePermCount + 1

                        }

                        if (perm.permission.indexOf('view_') !== -1) {

                            vm.isViewIndeterminate = true;

                            viewPermCount = viewPermCount + 1

                        }

                    }


                })

            });

            if (managePermCount === vm.selectedRows.length && vm.selectedRows.length !== 0) {
                vm.isManageChecked = true;
                vm.isManageIndeterminate = false;
            }

            if (changePermCount === vm.selectedRows.length && vm.selectedRows.length !== 0) {
                vm.isChangeChecked = true;
                vm.isChangeIndeterminate = false;
            }

            if (viewPermCount === vm.selectedRows.length && vm.selectedRows.length !== 0) {
                vm.isViewChecked = true;
                vm.isViewIndeterminate = false;
            }

            console.timeEnd("Update States");

            setTimeout(function () {
                $scope.$apply();
            },0)

        };

        parentEntityViewerEventService.addEventListener(evEvents.FINISH_RENDER, function () {

            vm.selectedRows = vm.getSelectedRows();

            console.log('activeGroup', vm.activeGroup);

            if (vm.activeGroup) {
                vm.updateStates();
            }

        });

        vm.init = function () {

            vm.entityType = parentEntityViewerDataService.getEntityType();

            vm.getGroups()
        };

        vm.init();

    }

}());