(function () {

    'use strict';

    var uiService = require('../../services/uiService')

    module.exports = function ($scope, $mdDialog, data, entityViewerDataService) {

        var vm = this;

        vm.column = null;
        vm.layout = null;

        vm.selectAll = false;

        vm.readyStatus = {content: false};

        vm.newValues = [];

        vm.agree = function ($event) {

            let response = {
                status: 'agree',
            }

            if (vm.layout.id) {

                uiService.updateColumnSortData(vm.layout.id, vm.layout).then(function (data) {
                    response.data = data;
                    $mdDialog.hide(response);
                })


            } else {
                uiService.createColumnSortData(vm.layout).then(function (data) {
                    response.data = data;
                    $mdDialog.hide(response);
                })

            }

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.toggleSelectAll = function () {

            vm.selectAll = !vm.selectAll;

            vm.newValues = vm.newValues.map(function (item) {

                item.selected = vm.selectAll;

                return item
            })

        }

        vm.addSelected = function () {

            vm.newValues.forEach(function (item) {

                if (item.selected) {
                    vm.layout.data.items.push({
                        order: vm.layout.data.items.length,
                        value: item.value
                    })

                }

            })

            vm.newValues = vm.newValues.filter(function (item) {
                return !item.selected;
            })

        }

        vm.syncDataStructure = function () {

            if (!vm.layout.data.items) {
                vm.layout.data.items = []
            }

            var flatListItems = entityViewerDataService.getFlatList();
            var uniqueColumnValues = []
            var value;

            flatListItems.forEach(function (flatListItem) {

                if (flatListItem.___type === 'object') {

                    value = flatListItem[vm.column.key]

                    if (uniqueColumnValues.indexOf(value) === -1) {
                        uniqueColumnValues.push(value)
                    }

                }


            })

            if (vm.layout.data.items.length) {

                var exist = false;

                uniqueColumnValues.forEach(function (value, index) {

                    exist = false;

                    vm.layout.data.items.forEach(function (item) {

                        if (item.value === value) {
                            exist = true;
                        }

                    })

                    if (exist === false) {

                        vm.newValues.push({
                            order: vm.newValues.length,
                            value: value
                        })

                    }


                })


            } else {

                uniqueColumnValues.forEach(function (value, index) {

                    vm.layout.data.items.push({
                        order: index + 1,
                        value: value
                    })

                })

            }

            console.log('vm.syncDataStructure.newValues', vm.newValues);

        }

        vm.moveUp = function (item) {

            console.log('moveUp', item);

            var currentOrder = item.order
            var order;

            vm.layout.data.items = vm.layout.data.items.map(function (item, index) {

                order = index + 1;

                if (currentOrder === order) { // decrease order of current value
                    item.order = item.order - 1;
                }

                if (currentOrder - 1 === order) { // increase order of next value
                    item.order = item.order + 1;
                }

                return item


            })

            vm.layout.data.items = vm.layout.data.items.sort(function (a, b) {
                return a.order - b.order
            })

        }

        vm.moveDown = function (item) {

            console.log('moveDown', item);

            var currentOrder = item.order
            var order;

            vm.layout.data.items = vm.layout.data.items.map(function (item, index) {

                order = index + 1;

                if (currentOrder === order) { // increase order of current value
                    item.order = item.order + 1;
                }

                if (currentOrder + 1 === order) { // decrease order of next value
                    item.order = item.order - 1;
                }

                return item


            })

            vm.layout.data.items = vm.layout.data.items.sort(function (a, b) {
                return a.order - b.order
            })

        }

        vm.delete = function (item, $index) {

            var currentOrder = item.order
            var order;

            vm.layout.data.items = vm.layout.data.items.filter(function (item, index) {

                order = index + 1;

                return item.order !== currentOrder;

            })

            vm.layout.data.items = vm.layout.data.items.map(function (item, index) {

                order = index + 1;

                if (order > currentOrder) { // increase order of current value
                    item.order = item.order - 1;
                }

                return item


            })

            vm.layout.data.items = vm.layout.data.items.sort(function (a, b) {
                return a.order - b.order
            })

        }

        vm.addNewValue = function () {

            vm.layout.data.items.push({
                order: vm.layout.data.items.length,
                value: vm.newValue
            })

            vm.newValue = null;

        }

        vm.init = function () {

            console.log('data', data);

            vm.column = JSON.parse(angular.toJson( data.column ));

            if (data.item) {
                vm.layout = data.item;
            } else {
                vm.layout = {
                    name: '',
                    user_code: '',
                    column_key: vm.column.key,
                    data: {}
                }
            }

            vm.readyStatus.content = true;

            if (entityViewerDataService) {
                vm.syncDataStructure();
            }


        };

        vm.init();

    }
}());