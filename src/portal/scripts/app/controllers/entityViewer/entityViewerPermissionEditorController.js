/**
 * Created by szhitenev on 09.01.2017.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var usersService = require('../../services/usersService');
    var usersGroupService = require('../../services/usersGroupService');
    var entityResolverService = require('../../services/entityResolverService');


    module.exports = function ($scope) {

        logService.controller('EntityViewerPermissionEditorController', 'initialized');

        var vm = this;

        vm.readyStatus = {users: false, groups: false};

        vm.processing = false;

        vm.getUsers = function () {

            vm.readyStatus.users = false;

            usersService.getMemberList().then(function (data) {

                //console.log('users data', data);

                vm.users = data.results;

                vm.readyStatus.users = true;

                $scope.$apply();
            })
        };

        vm.getGroups = function () {

            vm.readyStatus.groups = false;

            usersGroupService.getList().then(function (data) {

                //console.log('groups data', data);

                vm.groups = data.results;

                vm.readyStatus.groups = true;

                $scope.$apply();
            })
        };

        /*
         @entity: user / group
         */

        vm.selectEntity = function (type, item) {

            if (type == 'user') {
                vm.users.forEach(function (user) {
                    user.isSelected = false;
                });

                item.isSelected = !item.isSelected;

                if (item.isSelected == true) {

                    $scope.$parent.options.externalCallback({
                        silent: true,
                        options: {
                            permission_selected_id: item.id,
                            permission_selected_entity: 'user'
                        }
                    })

                }


            } else {
                vm.groups.forEach(function (user) {
                    user.isSelected = false;
                });

                item.isSelected = !item.isSelected;

                if (item.isSelected == true) {

                    $scope.$parent.options.externalCallback({
                        silent: true,
                        options: {
                            permission_selected_id: item.id,
                            permission_selected_entity: 'group'
                        }
                    })

                }

            }

            //console.log('1111111111111111111111111111111111111111111111111', $scope.$parent.items);

        };

        vm.toggleManage = function (entity) {

            if (!entity.hasOwnProperty('manager_actions')) {
                entity.manager_actions = {manage: false, change: false};
            }

            //console.log('$scope', $scope);
            //
            //console.log($scope.$parent.items);

            var selectedRows = [];
            var entityType = $scope.$parent.options.entityType;

            if ($scope.$parent.items[0].hasOwnProperty('groups')) {

                $scope.$parent.items.map(function (group) {
                    group.items.forEach(function (item) {

                        if (item.hasOwnProperty('selectedRow') && item.selectedRow == true) {
                            selectedRows.push(item);
                        }
                    });
                });
            } else {
                $scope.$parent.items.forEach(function (item) {
                    if (item.hasOwnProperty('selectedRow') && item.selectedRow == true) {
                        selectedRows.push(item);
                    }
                })
            }

            //console.log('selectedRows', selectedRows);

            entity.manager_actions.manage = !entity.manager_actions.manage;

            vm.updateBulk(selectedRows, entityType, entity);
        };

        /*
         @entity: user / group
         */

        vm.toggleChange = function (entity) {

            if (!entity.hasOwnProperty('manager_actions')) {
                entity.manager_actions = {manage: false, change: false};
            }

            var selectedRows = [];
            var entityType = $scope.$parent.options.entityType;

            if ($scope.$parent.items[0].hasOwnProperty('groups')) {

                $scope.$parent.items.map(function (group) {
                    group.items.forEach(function (item) {

                        if (item.hasOwnProperty('selectedRow') && item.selectedRow == true) {
                            selectedRows.push(item);
                        }
                    });
                });
            } else {
                $scope.$parent.items.forEach(function (item) {
                    if (item.hasOwnProperty('selectedRow') && item.selectedRow == true) {
                        selectedRows.push(item);
                    }
                })
            }

            //console.log('selectedRows', selectedRows);

            entity.manager_actions.change = !entity.manager_actions.change;

            vm.updateBulk(selectedRows, entityType, entity);
        };

        vm.updateBulk = function (selectedRows, entityType, entity) {

            vm.processing = true;

            var selectedRowsUpdated = selectedRows.map(function (item) {
                return {id: item.id, object_permissions: item.object_permissions};
            });

            if (entity.hasOwnProperty('first_name')) {

                selectedRowsUpdated.forEach(function (item) {

                    item.object_permissions.forEach(function (permission, $index) {

                        //console.log('entity USER', entity);
                        //console.log('permission', permission);

                        if (permission.member == entity.id) {
                            if (permission.group == null) {
                                item.object_permissions.splice($index, 1);

                                console.log('?here', item);
                            }
                        }

                    });

                    if (!item.hasOwnProperty('object_permissions')) {
                        item.object_permissions = [];
                    }

                    if (entity.hasOwnProperty('manager_actions')) {

                        if (entity.manager_actions.change == true) {
                            item.object_permissions.push(
                                {
                                    "group": null,
                                    "member": entity.id,
                                    "permission": "change_" + entityType.split('-').join('').toLowerCase()
                                }
                            )
                        }

                        if (entity.manager_actions.manage == true) {
                            item.object_permissions.push(
                                {
                                    "group": null,
                                    "member": entity.id,
                                    "permission": "manage_" + entityType.split('-').join('').toLowerCase()
                                }
                            )
                        }

                    }

                    //console.log('item', item);

                })

            } else {

                selectedRowsUpdated.forEach(function (item) {

                    item.object_permissions.forEach(function (permission, $index) {

                        if (permission.group == entity.id) {
                            if (permission.member == null) {
                                item.object_permissions.splice($index, 1);
                            }
                        }

                    });

                    if (!item.hasOwnProperty('object_permissions')) {
                        item.object_permissions = [];
                    }

                    if (entity.hasOwnProperty('manager_actions')) {

                        if (entity.manager_actions.change == true) {
                            item.object_permissions.push(
                                {
                                    "group": entity.id,
                                    "member": null,
                                    "permission": "change_" + entityType.split('-').join('').toLowerCase()
                                }
                            )
                        }

                        if (entity.manager_actions.manage == true) {
                            item.object_permissions.push({
                                "group": entity.id,
                                "member": null,
                                "permission": "manage_" + entityType.split('-').join('').toLowerCase()
                            })
                        }

                    }

                })
            }

            entityResolverService.updateBulk(entityType, selectedRowsUpdated).then(function () {
                vm.processing = false;
                $scope.$parent.options.externalCallback();
                $scope.$apply();
            })

        };

        vm.getUsers();
        vm.getGroups();
    }

}());