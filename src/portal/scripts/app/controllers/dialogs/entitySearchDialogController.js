/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var instrumentService = require('../../services/instrumentService');
    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;
        console.log('smart search dialog data', data);
        vm.entityType = data.entityType;

        vm.readyStatus = false;

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
            },
            'strategy-1': {
                'user_code': '',
                'name': '',
                'short_name': ''
            },
            'strategy-2': {
                'user_code': '',
                'name': '',
                'short_name': ''
            },
            'strategy-3': {
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
                },
                {
                    key: 'instrument_type_object.name',
                    name: 'Instrument type'
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
            'strategy-1': [
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
            'strategy-2': [
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
            'strategy-3': [
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
            ]
        };

        vm.items = [];
        vm.selectedItem = {};

        vm.agree = function () {

            if (itemsToDelete.length > 0) {
                itemsToDelete.forEach(function (itemId) {
                    entityResolverService.deleteByKey(vm.entityType, itemId);
                });
            }

            $mdDialog.hide({status: 'agree', data: {item: vm.selectedItem, items: vm.items}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.getTdValue = function (item, columnKey) {
            // check if value positioned on a deeper level of an object
            if (columnKey.indexOf('.') !== -1) {

                var objectPathToValue = columnKey.split('.'); //an array of properties leading to a needed value
                var currentPath = item; // current nesting level in the object

                var i;
                for (i = 0; i < objectPathToValue.length; i++) {
                    if (!currentPath[objectPathToValue[i]]) {
                        break;
                    } else {
                        currentPath = currentPath[objectPathToValue[i]];
                    }
                }

                return currentPath;
            } else {
                return item[columnKey];
            }
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

        vm.sort;
        vm.sortDescending = true;

        vm.sortBy = function (sortParameter) {

            var sortOrder = 'DSC';
            if (vm.sort === sortParameter) {

                vm.sortDescending = !vm.sortDescending;

                if (vm.sortDescending) {
                    sortOrder = 'DSC';
                }
                else {
                    sortOrder = 'ASC';
                }
            }
            else {
                vm.sort = sortParameter
                vm.sortDescending = true;
            }

            var sortingOptions = {
                key: sortParameter,
                direction: sortOrder
            };

            vm.updateTable(sortingOptions);

        };

        vm.editItem = function (itemId, $event) {

            $mdDialog.show({
                controller: 'EntityViewerEditDialogController as vm',
                templateUrl: 'views/entity-viewer/edit-entity-viewer-dialog-view.html',
                parent: $(''),
                targetEvent: $event,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    entityType: vm.entityType,
                    entityId: itemId
                }
            }).then(function (data) {

                if (data.res === 'agree') {
                    vm.updateTable();
                }

            })
        };

        var itemsToDelete = [];
        vm.deleteItem = function (item, index) {
            vm.items.splice(index, 1);
            itemsToDelete.push(item.id);
        };

        entityResolverService.getList(vm.entityType, {filters: vm.search[vm.entityType]}).then(function (data) {
            vm.items = data.results;
            $scope.$apply();
        });

        vm.updateTable = function (sortingOptions) {
            var options = {};

            if (sortingOptions) {
                options.sort = new Object();
                options.sort = sortingOptions;
            }

            options.filters = vm.search[vm.entityType];

            entityResolverService.getList(vm.entityType, options).then(function (data) {

                vm.items = data.results;
                vm.readyStatus = true;
                $scope.$apply();
            })
        }

    };

}());