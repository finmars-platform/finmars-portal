/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    // var usersService = require('../../services/usersService');
    // var usersGroupService = require('../../services/usersGroupService');

    // var metaService = require('../../services/metaService');

    var balanceReportCustomAttrService = require('../../services/reports/balanceReportCustomAttrService');
    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('BalanceReportCustomAttrController', 'initialized');

        var vm = this;
        vm.attribute = {};
        vm.attributeId;
        vm.readyStatus = {attribute: false, permissions: false};

        vm.editRestriction = data.editRestriction;
        if (vm.editRestriction) {
            vm.attributeId = data.attributeId;
            console.log('balance attribute id', vm.attributeId);
            balanceReportCustomAttrService.getByKey(vm.attributeId).then(function (data) {
                console.log('balance edit attr data', data);
                vm.attribute = data;
                vm.readyStatus.attribute = true;
                $scope.$apply();
            });
        }
        else {
            vm.attribute = {name: '', expr: ''};
            vm.readyStatus.attribute = true;
            console.log('balance report create custom attr');
        }

        vm.setupConfig = function ($event) {
            $mdDialog.show({
                controller: 'CustomFieldsConfigDialogController as vm',
                templateUrl: 'views/dialogs/custom-fields-config-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        customField: vm.attribute
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                console.log('res', res);

                if (res.status === 'agree') {

                    vm.attribute.expr = res.data.expression;
                    vm.attribute.layout = res.data.layout;

                }
            });
        };

        // vm.valueTypes = [];

        // vm.loadPermissions = function () {

        //     var promises = [];

        //     promises.push(vm.getMemberList());
        //     promises.push(vm.getGroupList());

        //     Promise.all(promises).then(function (data) {

        //         vm.readyStatus.permissions = true;
        //         $scope.$apply();
        //     });

        // };

        // vm.getGroupList = function () {
        //     return usersGroupService.getList().then(function (data) {

        //         //console.log('data MEMBERS', data);

        //         vm.groups = data.results;

        //         vm.groups.forEach(function (group) {

        //             if (vm.attribute["group_object_permissions"]) {
        //                 vm.attribute["group_object_permissions"].forEach(function (permission) {

        //                     if (permission.group == group.id) {
        //                         if (!group.hasOwnProperty('objectPermissions')) {
        //                             group.objectPermissions = {};
        //                         }
        //                         if (permission.permission === "manage_" + vm.entityType + 'attributetype') {
        //                             group.objectPermissions.manage = true;
        //                         }
        //                         if (permission.permission === "change_" + vm.entityType + 'attributetype') {
        //                             group.objectPermissions.change = true;
        //                         }
        //                     }
        //                 })
        //             }

        //         });
        //     });

        // };

        // vm.getMemberList = function () {
        //     return usersService.getMemberList().then(function (data) {

        //         //console.log('data MEMBERS', data);

        //         vm.members = data.results;

        //         vm.members.forEach(function (member) {

        //             if (vm.attribute["user_object_permissions"]) {
        //                 vm.attribute["user_object_permissions"].forEach(function (permission) {

        //                     if (permission.member == member.id) {
        //                         if (!member.hasOwnProperty('objectPermissions')) {
        //                             member.objectPermissions = {};
        //                         }
        //                         if (permission.permission === "manage_" + vm.entityType + 'attributetype') {
        //                             member.objectPermissions.manage = true;
        //                         }
        //                         if (permission.permission === "change_" + vm.entityType + 'attributetype') {
        //                             member.objectPermissions.change = true;
        //                         }
        //                     }
        //                 })
        //             }

        //         });
        //     });
        // };

        // vm.checkPermissions = function () {

        //     if (vm.attributeId) {

        //         var haveAccess = false;

        //         if (vm.attribute.granted_permissions.indexOf("manage_" + vm.entityType + 'attributetype') !== -1) {
        //             haveAccess = true;
        //         }

        //         return haveAccess;
        //     } else {
        //         return true;
        //     }
        // };

        // vm.loadPermissions();

        // vm.valueTypes = metaService.getDynamicAttrsValueTypesCaptions();
        // console.log("Value type is ", vm.valueTypes);

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {attribute: vm.attribute}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());