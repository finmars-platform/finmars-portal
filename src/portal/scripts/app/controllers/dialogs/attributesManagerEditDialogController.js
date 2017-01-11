/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var usersService = require('../../services/usersService');
    var usersGroupService = require('../../services/usersGroupService');

    var metaService = require('../../services/metaService');

    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('AttributesAddDialogManagerController', 'initialized');

        var vm = this;

        vm.readyStatus = {attribute: false, permissions: false};

         vm.entityType = data.entityType;
        vm.attributeId = data.attributeId;

        //attributeTypeService.getByKey("generic", vm.attributeId).then(function (data) {
        attributeTypeService.getByKey(vm.entityType, vm.attributeId).then(function (data) {
            vm.attribute = data;
            vm.readyStatus.attribute = true;
            vm.loadPermissions();
            $scope.$apply();
        });

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getMemberList());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;
                $scope.$apply();
            });

        };

        vm.getGroupList = function () {
            return usersGroupService.getList().then(function (data) {

                //console.log('data MEMBERS', data);

                vm.groups = data.results;

                vm.groups.forEach(function (group) {

                    if (vm.attribute["group_object_permissions"]) {
                        vm.attribute["group_object_permissions"].forEach(function (permission) {

                            if (permission.group == group.id) {
                                if (!group.hasOwnProperty('objectPermissions')) {
                                    group.objectPermissions = {};
                                }
                                if (permission.permission === "manage_" + "generic" + 'attributetype') {
                                    group.objectPermissions.manage = true;
                                }
                                if (permission.permission === "change_" + "generic" + 'attributetype') {
                                    group.objectPermissions.change = true;
                                }
                            }
                        })
                    }

                });
            });

        };

        vm.getMemberList = function () {
            return usersService.getMemberList().then(function (data) {

                //console.log('data MEMBERS', data);

                vm.members = data.results;

                vm.members.forEach(function (member) {

                    if (vm.attribute["user_object_permissions"]) {
                        vm.attribute["user_object_permissions"].forEach(function (permission) {

                            if (permission.member == member.id) {
                                if (!member.hasOwnProperty('objectPermissions')) {
                                    member.objectPermissions = {};
                                }
                                if (permission.permission === "manage_" + "generic" + 'attributetype') {
                                    member.objectPermissions.manage = true;
                                }
                                if (permission.permission === "change_" + "generic" + 'attributetype') {
                                    member.objectPermissions.change = true;
                                }
                            }
                        })
                    }

                });
            });
        };

        vm.checkPermissions = function () {

            if (vm.attributeId) {

                var haveAccess = false;

                if (vm.attribute.granted_permissions.indexOf("manage_" + "generic" + 'attributetype') !== -1) {
                    haveAccess = true;
                }

                return haveAccess;
            } else {
                return true;
            }
        };

        vm.editRestriction = true;

        console.log('vm.attribute', vm.attribute);

        vm.valueTypes = metaService.getDynamicAttrsValueTypesCaptions();

        vm.agree = function () {
            console.log('vm.attr', vm.attribute);

            vm.attribute["user_object_permissions"] = [];

            vm.members.forEach(function (member) {

                if (member.objectPermissions && member.objectPermissions.manage == true) {
                    vm.attribute["user_object_permissions"].push({
                        "member": member.id,
                        "permission": "manage_" + "generic" + 'attributetype'
                    })
                }

                if (member.objectPermissions && member.objectPermissions.change == true) {
                    vm.attribute["user_object_permissions"].push({
                        "member": member.id,
                        "permission": "change_" + "generic" + 'attributetype'
                    })
                }

            });

            vm.attribute["group_object_permissions"] = [];

            vm.groups.forEach(function (group) {

                if (group.objectPermissions && group.objectPermissions.manage == true) {
                    vm.attribute["group_object_permissions"].push({
                        "group": group.id,
                        "permission": "manage_" + "generic" + 'attributetype'
                    })
                }

                if (group.objectPermissions && group.objectPermissions.change == true) {
                    vm.attribute["group_object_permissions"].push({
                        "group": group.id,
                        "permission": "change_" + "generic" + 'attributetype'
                    })
                }

            });


            $mdDialog.hide({status: 'agree', data: {attribute: vm.attribute}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());