(function () {

    'use strict';

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog, groupId) {

        var vm = this;

        vm.membersList = [];
        vm.assignedMembersList = [];

        vm.group = null;

        vm.readyStatus = {content: false};

        vm.permissionTable = [
            {
                name: "Portfolios",
                content_type: "portfolios.portfolio",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Accounts",
                content_type: "accounts.account",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Instruments",
                content_type: "instruments.instrument",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Counterparties",
                content_type: "counterparties.counterparty",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Responsibles",
                content_type: "counterparties.responsible",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Currency",
                content_type: "currencies.currency",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Strategy 1",
                content_type: "strategies.strategy1",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Strategy 2",
                content_type: "strategies.strategy2",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Strategy 3",
                content_type: "strategies.strategy3",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Account Type",
                content_type: "accounts.accounttype",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Instrument Type",
                content_type: "instruments.instrumenttype",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            },
            {
                name: "Transaction Type",
                content_type: "transactions.transactiontype",
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: false
                }
            }
        ];

        vm.presetChange = function ($event) {

            console.log('activePreset', vm.activePresetId);

            var preset;

            vm.presets.forEach(function (item) {

                if (item.id === vm.activePresetId) {
                    preset = item
                }

            });

            console.log('preset', preset);

            vm.permissionTable = vm.permissionTable.map(function (item) {

                Object.keys(preset.data).forEach(function (key) {

                    item.data[key] = preset.data[key]

                });

                return item

            });

            setTimeout(function () {
                $scope.$apply();
            }, 0);

            console.log('vm.permissionTable', vm.permissionTable);

        };

        vm.canInheritRight = function (contentType) {

            return ['accounts.account', 'instruments.instrument'].indexOf(contentType) !== -1

        };

        vm.getData = function () {

            membersAndGroupsService.getGroupByKey(groupId).then(function (data) {

                vm.group = data;

                if (vm.group.permission_table) {
                    vm.permissionTable = vm.group.permission_table;
                }

                membersAndGroupsService.getMembersList().then(function (data) {

                    vm.membersList = data.results;

                    var assignedMembersIds = vm.group.members;

                    if (assignedMembersIds && assignedMembersIds.length > 0) {

                        assignedMembersIds.map(function (assignedId) {

                            vm.membersList.map(function (member, memberIndex) {

                                var memberId = member['id'];

                                if (memberId === assignedId) {

                                    vm.membersList.splice(memberIndex, 1);
                                    vm.assignedMembersList.push(member);

                                }

                            });
                        });
                    }

                    console.log('vm.membersList', vm.membersList);
                    console.log('vm.assignedMembersList', vm.assignedMembersList);

                    vm.readyStatus.content = true;

                    $scope.$apply();
                });

            });

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {

            vm.group.members = vm.assignedMembersList.map(function (group) {
                return group.id
            });

            vm.group.permission_table = vm.permissionTable;

            membersAndGroupsService.updateGroup(vm.group.id, vm.group).then(function () {
                $mdDialog.hide({status: 'agree'});
            });

        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();
    }

}());