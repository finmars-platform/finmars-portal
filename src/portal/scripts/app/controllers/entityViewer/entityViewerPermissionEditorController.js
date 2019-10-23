/**
 * Created by szhitenev on 09.01.2017.
 */
(function () {

    'use strict';

    var usersGroupService = require('../../services/usersGroupService');
    var entityResolverService = require('../../services/entityResolverService');
    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($scope, $mdDialog, $transitions, parentEntityViewerDataService, parentEntityViewerEventService, splitPanelExchangeService) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.processing = false;
        vm.activeGroup = null;

        vm.selectedRows = [];

        vm.getGroups = function () {

            vm.readyStatus.content = false;

            usersGroupService.getList().then(function (data) {

                vm.groups = data.results;

                vm.readyStatus.content = true;

                $scope.$apply();
            })

        };

        vm.getSelectedRows = function(){

            var list = parentEntityViewerDataService.getFlatList();

            return list.filter(function (item) {
                return item.___is_activated
            })


        };

        vm.setActiveGroup = function(group){

            vm.activeGroup = group

        };

        vm.grantManage = function () {

            vm.selectedRows = vm.getSelectedRows();

            console.log('vm.selectedRows', vm.selectedRows);

            var permission_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();

            var results = vm.selectedRows.map(function (item) {

                var exists = false;

                item.object_permissions.forEach(function (perm) {

                    if (perm.group === vm.activeGroup.id && perm.permission === permission_code) {
                        exists = true;
                    }

                });

                if (!exists) {

                    item.object_permissions.push({
                        "group": vm.activeGroup.id,
                        "member": null,
                        "permission": permission_code
                    })

                }

                return item
            });

            vm.updatePermissions(results);
        };

        vm.revokeManage = function () {

            vm.selectedRows = vm.getSelectedRows();

            console.log('vm.selectedRows', vm.selectedRows);

            var permission_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();

            var results = vm.selectedRows.map(function (item) {

                item.object_permissions = item.object_permissions.filter(function (perm) {

                    if (perm.group === vm.activeGroup.id && perm.permission === permission_code) {
                        return false
                    }

                    return true

                });

                return item
            });

            vm.updatePermissions(results);
        };

        vm.grantChange = function () {

            vm.selectedRows = vm.getSelectedRows();

            console.log('vm.selectedRows', vm.selectedRows);

            var permission_code = "change_" + vm.entityType.split('-').join('').toLowerCase();

            var results = vm.selectedRows.map(function (item) {

                var exists = false;

                item.object_permissions.forEach(function (perm) {

                    if (perm.group === vm.activeGroup.id && perm.permission === permission_code) {
                        exists = true;
                    }

                });

                if (!exists) {

                    item.object_permissions.push({
                        "group": vm.activeGroup.id,
                        "member": null,
                        "permission": permission_code
                    })

                }

                return item
            });

            vm.updatePermissions(results);
        };

        vm.revokeChange = function () {

            vm.selectedRows = vm.getSelectedRows();

            console.log('vm.selectedRows', vm.selectedRows);

            var permission_code = "change_" + vm.entityType.split('-').join('').toLowerCase();

            var results = vm.selectedRows.map(function (item) {

                item.object_permissions = item.object_permissions.filter(function (perm) {

                    if (perm.group === vm.activeGroup.id && perm.permission === permission_code) {
                        return false
                    }

                    return true

                });

                return item
            });

            vm.updatePermissions(results);
        };

        vm.updatePermissions = function (items) {

            entityResolverService.updateBulk(vm.entityType, items).then(function () {
                vm.processing = false;
                $scope.$apply();
            })

        };

        vm.init = function () {

            vm.entityType = parentEntityViewerDataService.getEntityType();

            vm.getGroups()
        };

        vm.init();

    }

}());