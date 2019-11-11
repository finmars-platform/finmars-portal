(function () {

    'use strict';

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.group = {
            name: '',
            is_public: false,
            members: []
        };

        vm.membersList = [];
        vm.assignedMembersList = [];

        vm.processing = false;

        vm.readyStatus = {content: false};

        vm.presets = [
            {
                id: 1,
                name: 'Administrators',
                data: {
                    create_objects: true,
                    inherit_rights: false,
                    creator_manage: true,
                    creator_change: true,
                    creator_view: true,
                    other_manage: true,
                    other_change: true,
                    other_view: true
                }
            },
            {
                id: 2,
                name: 'Extended Access Users',
                data: {
                    create_objects: true,
                    inherit_rights: false,
                    creator_manage: true,
                    creator_change: true,
                    creator_view: true,
                    other_manage: false,
                    other_change: true,
                    other_view: true
                }
            },
            {
                id: 3,
                name: 'Normal Access Users',
                data: {
                    create_objects: true,
                    inherit_rights: true,
                    creator_manage: false,
                    creator_change: true,
                    creator_view: true,
                    other_manage: false,
                    other_change: true,
                    other_view: true
                }
            },
            {
                id: 4,
                name: 'Restricted Access Users',
                data: {
                    create_objects: true,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: true,
                    creator_view: true,
                    other_manage: false,
                    other_change: false,
                    other_view: true
                }
            },
            {
                id: 5,
                name: 'View Access Users',
                data: {
                    create_objects: false,
                    inherit_rights: false,
                    creator_manage: false,
                    creator_change: false,
                    creator_view: false,
                    other_manage: false,
                    other_change: false,
                    other_view: true
                }
            },
            {
                id: 6,
                name: 'Restricted Access Guests',
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

        vm.activePresetId = 6;

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
            },0);

            console.log('vm.permissionTable', vm.permissionTable);

        };


        vm.getData = function () {

            membersAndGroupsService.getMembersList().then(function (data) {

                vm.membersList = data.results;

                console.log('vm.membersList', vm.membersList);

                vm.readyStatus.content = true;

                $scope.$apply();
            });

        };

        vm.agree = function () {

            vm.processing = true;

            vm.group.members = vm.assignedMembersList.map(function (group) {
                return group.id
            });

            vm.group.permission_table = vm.permissionTable;

            membersAndGroupsService.createGroup(vm.group).then(function () {

                vm.processing = false;

                $mdDialog.hide({status: 'agree'});

            })

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();

    }
}());