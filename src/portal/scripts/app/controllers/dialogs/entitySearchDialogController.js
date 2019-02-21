/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var instrumentService = require('../../services/instrumentService');
    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;

        vm.search = {
            'instrument': {
                'user_code': '',
                'name': '',
                'short_name': '',
                'user_text_1': '',
                'user_text_2': '',
                'user_text_3': ''
            },
            'account': {
                'user_code': '',
                'name': '',
                'short_name': ''
            },
            'portfolio': {
                'user_code': '',
                'name': '',
                'short_name': ''
            },
            'responsible': {
                'user_code': '',
                'name': '',
                'short_name': ''
            },
            'counterparty': {
                'user_code': '',
                'name': '',
                'short_name': ''
            }
        };

        vm.columns = {
            'instrument': [
                {
                    key: 'user_code',
                    name: 'User code'
                },
                {
                    key: 'name',
                    name: 'Name'
                },
                {
                    key: 'short_name',
                    name: 'Short name'
                },
                {
                    key: 'user_text_1',
                    name: 'User text 1'
                },
                {
                    key: 'user_text_2',
                    name: 'User text 2'
                },
                {
                    key: 'user_text_3',
                    name: 'User text 3'
                }
            ],
            'account': [
                {
                    key: 'user_code',
                    name: 'User code'
                },
                {
                    key: 'name',
                    name: 'Name'
                },
                {
                    key: 'short_name',
                    name: 'Short name'
                }
            ],
            'portfolio': [
                {
                    key: 'user_code',
                    name: 'User code'
                },
                {
                    key: 'name',
                    name: 'Name'
                },
                {
                    key: 'short_name',
                    name: 'Short name'
                }
            ],
            'responsible': [
                {
                    key: 'user_code',
                    name: 'User code'
                },
                {
                    key: 'name',
                    name: 'Name'
                },
                {
                    key: 'short_name',
                    name: 'Short name'
                }
            ],
            'counterparty': [
                {
                    key: 'user_code',
                    name: 'User code'
                },
                {
                    key: 'name',
                    name: 'Name'
                },
                {
                    key: 'short_name',
                    name: 'Short name'
                }
            ],
        };

        vm.items = [];
        vm.selectedItem = {};

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.selectedItem, items: vm.items}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.selectRow = function (item) {
            vm.items.forEach(function (item) {
                item.active = false;
            });
            vm.selectedItem = item;
            item.active = true;
        };

        vm.selectAndSave = function (item) {
            $mdDialog.hide({status: 'agree', data: {item: item, items: vm.items}});
        };

        entityResolverService.getList(vm.entityType, {filters: vm.search[vm.entityType]}).then(function (data) {
            vm.items = data.results;
            $scope.$apply();
        });

        vm.updateTable = function () {
            entityResolverService.getList(vm.entityType, {filters: vm.search[vm.entityType]}).then(function (data) {
                vm.items = data.results;
                $scope.$apply();
            })
        }

    };

}());